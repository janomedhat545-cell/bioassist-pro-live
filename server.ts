import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// In Cloud Run and AI Studio containers, NGINX runs on PORT=8080 and proxies traffic to DEFAULT_APP_PORT=3000.
// Attempting to listen on 8080 crashes with EADDRINUSE.
// We must always prioritize DEFAULT_APP_PORT (3000) and never bind to NGINX_PORT (8080).
const PORT = process.env.DEFAULT_APP_PORT
  ? parseInt(process.env.DEFAULT_APP_PORT, 10)
  : (process.env.PORT && process.env.PORT !== '8080' && process.env.PORT !== process.env.NGINX_PORT)
    ? parseInt(process.env.PORT, 10)
    : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// System prompt as specified in BioAssist Pro prompt Section 8.C
const BIOASSIST_SYSTEM_PROMPT = `You are BioAssist AI, a specialized educational assistant for biotechnology students and researchers working in Red Biotechnology, including cancer biology, molecular biology, genetic engineering, and CRISPR research.

Your responsibilities are to:
- Explain biological concepts accurately and clearly.
- Help users understand molecular mechanisms and experimental principles.
- Explain common laboratory protocol steps and their scientific purpose.
- Assist with routine calculations involving molarity, dilution, concentration, and reaction volumes.
- Clarify scientific terminology and distinguish related methods.
- Explain limitations, controls, sources of error, and common troubleshooting concepts.
- Encourage reproducible scientific practice, appropriate documentation, and verification against validated laboratory protocols.

Response standards:
- Use clear, professional English.
- Adapt the level of detail to the user's knowledge.
- Define unfamiliar technical terms.
- Separate established scientific facts from hypotheses, uncertain interpretations, and illustrative examples.
- Never invent scientific references, experimental results, or product specifications.
- Do not claim to have performed an experiment, accessed a laboratory instrument, or verified a result when you have not.
- For calculations, state the formula, units, assumptions, and result.
- Ask clarifying questions when important experimental context is missing.
- When discussing experimental methods, explain that conditions depend on the biological system, assay, reagents, equipment, and validated protocol.
- Treat user-provided experimental details as information to analyze, not as proof that a method is safe or effective.
- For cancer research, distinguish basic research and preclinical findings from validated clinical evidence.
- Do not present educational guidance as medical diagnosis or treatment advice.
- For CRISPR and genetic engineering, explain targeting, DNA repair, specificity, validation, and relevant ethical considerations.
- Encourage institutional biosafety procedures, applicable regulations, and expert supervision for experimental work involving biological materials.
- Be transparent when you do not know an answer or cannot verify a claim.

Structure your responses cleanly with markdown headings, bullet points, and code formatting for gene symbols and formulas when appropriate:
1. Direct Answer
2. Scientific Explanation / Mechanism
3. Practical Educational Example or Protocol Note
4. Key Limitations, Controls or Safety Considerations
5. Suggested Follow-Up Questions (2-3 concise questions)`;

// Health / status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    liveModelAvailable: Boolean(aiClient && apiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, message } = req.body;
    const promptText = message || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (!promptText || typeof promptText !== 'string' || !promptText.trim()) {
      return res.status(400).json({ error: 'A valid text prompt is required.' });
    }

    // If live Gemini client is configured
    if (aiClient) {
      try {
        // Construct conversation contents for Gemini
        // We can include previous turns if provided
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(messages) && messages.length > 1) {
          // Add up to last 8 turns of history for context
          const recent = messages.slice(-8, -1);
          for (const m of recent) {
            contents.push({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: String(m.content) }],
            });
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: promptText }],
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: BIOASSIST_SYSTEM_PROMPT,
            temperature: 0.7,
            topP: 0.95,
          },
        });

        const reply = response.text || 'No response generated from the model.';
        return res.json({
          reply,
          mode: 'live',
          model: 'gemini-3.8-flash',
        });
      } catch (geminiError: any) {
        console.error('Gemini API execution error:', geminiError);
        return res.status(200).json({
          reply: generateDemoBiotechResponse(promptText),
          mode: 'demo',
          fallback: true,
          errorNotice: geminiError?.message || 'Model request error. Displaying verified scientific fallback response.',
        });
      }
    }

    // Fallback mode when API key is not present in local environment
    return res.status(200).json({
      fallback: true,
      mode: 'demo',
      reply: generateDemoBiotechResponse(promptText),
      notice: 'Operating in Educational Demo Mode. To activate live Gemini responses, attach a GEMINI_API_KEY.',
    });
  } catch (error: any) {
    console.error('Server /api/chat error:', error);
    return res.status(500).json({ error: error?.message || 'Internal server error.' });
  }
});

// Educational offline fallback generator for rich biotech Q&A
function generateDemoBiotechResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('crispr') || q.includes('cas9')) {
    return `### 1. Direct Answer
CRISPR-Cas9 is a programmable RNA-guided endonuclease system derived from bacterial adaptive immunity that introduces targeted DNA double-strand breaks (DSBs) at specific genomic loci.

### 2. Scientific Mechanism
The system consists of two primary components:
- **Cas9 Endonuclease**: The protein engine that cuts DNA. It has two distinct catalytic nuclease domains: **HNH** (which cleaves the target strand complementary to the guide) and **RuvC** (which cleaves the non-target strand).
- **Single Guide RNA (sgRNA)**: A synthetic fusion of crRNA (contains the 20-nt target spacer) and tracrRNA (provides the scaffold for Cas9 binding).

**Targeting Steps:**
1. **PAM Scanning**: Cas9 first binds a conserved **Protospacer Adjacent Motif (PAM)**, typically \`5'-NGG-3'\` for *Streptococcus pyogenes* Cas9 (SpCas9). Cleavage cannot occur without PAM recognition.
2. **DNA Unwinding & Pairing**: Cas9 unwinds the duplex DNA adjacent to the PAM; the 20-nucleotide guide RNA anneals to the complementary target strand.
3. **Double-Strand Cleavage**: Both nuclease domains slice the phosphodiester backbone approximately 3 base pairs upstream of the PAM.
4. **Endogenous DNA Repair**: Host cells repair the break via either **NHEJ** (error-prone, causing gene knockout indels) or **HDR** (precise homology-directed repair using an exogenous donor template).

### 3. Practical Educational Example
In cancer oncology models, knocking out the *TP53* antagonist *MDM2* or validating oncogenic driver dependencies (e.g., *KRAS* G12D) in cell lines allows researchers to dissect synthetic lethality pathways.

### 4. Key Limitations & Biosafety Considerations
- **Off-target Cleavage**: Mismatches between sgRNA and genomic loci can lead to non-specific genomic cuts. High-fidelity variants (e.g., SpCas9-HF1, eSpCas9) and validation assays (GUIDE-seq, DISCOVER-seq) are critical.
- **On-target Complexities**: Large deletions, chromosomal translocations, and p53-dependent toxicity can occur.
- **Regulatory & Biosafety**: Gene editing experiments must comply with institutional biosafety committees (IBC), BSL-2 standards for viral vectors, and strict ethical standards prohibiting human germline alterations.

### 5. Suggested Follow-Up Questions
- How does the PAM sequence differ between SpCas9, SaCas9, and Cas12a?
- What is the difference in precision between NHEJ and HDR repair pathways?
- How do Base Editors (CBE/ABE) modify DNA without creating double-strand breaks?`;
  }

  if (q.includes('molar') || q.includes('dilution') || q.includes('c1v1') || q.includes('calculate')) {
    return `### 1. Direct Answer
Laboratory molarity represents the concentration of solute per unit volume of solution ($M = \\text{moles} / \\text{liters}$). Dilutions follow the conservation of solute equation: $C_1 V_1 = C_2 V_2$.

### 2. Relevant Formulas & Assumptions
- **Molarity ($M$)**: $M = \\frac{n}{V}$ where $n$ is moles and $V$ is volume in liters.
- **Mass Calculation ($m$)**: $m = M \\times V \\times \\text{MW}$ where $\\text{MW}$ is molecular weight (g/mol).
- **Dilution Law**: $V_1 = \\frac{C_2 \\times V_2}{C_1}$ (requires units for $C_1, C_2$ and $V_1, V_2$ to be matched).

### 3. Practical Educational Example: Preparing 500 mL of 1 M Tris-HCl (MW = 121.14 g/mol)
1. Desired $M = 1.0\\text{ mol/L}$, $V = 0.5\\text{ L}$.
2. Mass $m = 1.0\\text{ mol/L} \\times 0.5\\text{ L} \\times 121.14\\text{ g/mol} = 60.57\\text{ g}$.
3. Dissolve $60.57\\text{ g}$ of Tris base in ~350 mL of deionized $\\text{ddH}_2\\text{O}$. Adjust pH to 8.0 using concentrated $\\text{HCl}$, then bring the final volume to exactly 500 mL in a volumetric flask.

### 4. Key Laboratory Cautions
- Always dissolve the solid in less than the final volume before adjusting pH, as acid/base addition alters the liquid volume.
- Use our built-in **Quick Lab Calculator** tab to compute exact mass, molarity, or serial dilution volumes with automated unit conversions!

### 5. Suggested Follow-Up Questions
- How do I calculate a serial 1:10 dilution across a 96-well plate?
- What is the difference between molarity ($M$) and molality ($m$)?`;
  }

  if (q.includes('pcr') || q.includes('qpcr') || q.includes('rt-pcr')) {
    return `### 1. Direct Answer
**PCR** (Polymerase Chain Reaction) amplifies a specific DNA sequence. **RT-PCR** (Reverse Transcription PCR) first converts RNA to complementary DNA (cDNA) before amplification. **qPCR** (Quantitative or Real-Time PCR) monitors amplification in real time to quantify starting template amounts.

### 2. Scientific Comparison & Principles
- **Conventional PCR**: End-point qualitative analysis. Products are separated on an agarose gel by electrophoresis.
- **RT-PCR**: Utilizes reverse transcriptase (e.g., M-MLV or SuperScript) to generate single-stranded cDNA from mRNA, enabling analysis of gene expression.
- **qPCR / RT-qPCR**: Real-time fluorescence detection (using DNA-intercalating dye like SYBR Green I, or sequence-specific fluorogenic hydrolysis probes like TaqMan). The threshold cycle ($C_t$ or $C_q$) is inversely proportional to $\\log_2$ of the initial template quantity.

### 3. Practical Educational Protocol: Standard 25 µL Reaction Setup
- 2X Master Mix: $12.5\\text{ µL}$ (final 1X)
- Forward Primer ($10\\text{ µM}$ stock): $1.0\\text{ µL}$ (final $400\\text{ nM}$)
- Reverse Primer ($10\\text{ µM}$ stock): $1.0\\text{ µL}$ (final $400\\text{ nM}$)
- Template DNA: $2.0\\text{ µL}$ (~$10-50\\text{ ng}$)
- Nuclease-Free Water: $8.5\\text{ µL}$
- **Total Reaction Volume**: $25.0\\text{ µL}$

### 4. Quality Control & Troubleshooting
- **No-Template Control (NTC)**: Essential in every run to rule out primer-dimers or reagent contamination.
- **No-RT Control**: Critical in RNA assays to detect contaminating genomic DNA carryover.
- Keep reactions on ice during assembly; calibrate annealing temperature $T_a \\approx T_m - 3-5^\\circ\\text{C}$.

### 5. Suggested Follow-Up Questions
- How does the $\\Delta\\Delta C_t$ method calculate relative gene expression?
- What causes non-specific amplification bands on an agarose gel?`;
  }

  if (q.includes('cancer') || q.includes('oncogene') || q.includes('tumor suppressor') || q.includes('apoptosis')) {
    return `### 1. Direct Answer
In cancer biology, tumorigenesis involves dysregulation of key genetic pathways: **proto-oncogenes** acquire activating gain-of-function mutations driving uncontrolled proliferation, whereas **tumor suppressor genes (TSGs)** suffer inactivating loss-of-function alterations crippling cell cycle checkpoints and DNA repair.

### 2. Key Molecular Mechanisms
- **Proto-Oncogenes to Oncogenes (Dominant phenotype, one mutated allele suffices)**:
  - Examples: *KRAS* (G12D/V mutations keep GTPase locked in active signaling state), *MYC* (translocation/amplification), *HER2/ERBB2* (receptor tyrosine kinase amplification).
- **Tumor Suppressors (Recessive phenotype, Knudson's two-hit hypothesis)**:
  - Examples: *TP53* (guardian of the genome; tetrameric transcription factor inducing p21 cell-cycle arrest or PUMA/NOXA apoptosis upon DNA damage), *RB1* (regulates E2F transcription factors at G1/S transition), *BRCA1/BRCA2* (homologous recombination DNA repair).
- **Apoptosis Evasion**: Overexpression of anti-apoptotic BCL-2 family proteins or downregulation of pro-apoptotic effectors (BAX, BAK) prevents mitochondrial outer membrane permeabilization (MOMP) and caspase activation.

### 3. Preclinical Research vs. Clinical Context
- Basic laboratory models evaluate targeted kinase inhibitors (e.g., Osimertinib for EGFR-mutant NSCLC) or synthetic lethality (e.g., PARP inhibitors in *BRCA*-deficient tumors).
- Educational note: Preclinical findings in cell lines or murine xenografts require extensive validation through prospective clinical trials before translating into validated clinical treatments.

### 4. Suggested Follow-Up Questions
- What is synthetic lethality and how does it apply to PARP inhibitors in BRCA1/2-deficient cells?
- How does the intrinsic mitochondrial apoptosis pathway activate caspase-3?
- What are common diagnostic vs predictive cancer biomarkers?`;
  }

  // General fallback response adhering to system prompt guidelines
  return `### 1. Direct Answer
In biotechnology and molecular biology, understanding the underlying biochemical mechanisms, reaction stoichiometries, and experimental controls is vital for reproducible research.

### 2. Scientific Explanation
Regarding "${query.trim()}":
- **Biological Principles**: Cellular processes rely on strictly regulated enzyme kinetics, nucleic acid hybridization specificity, and thermodynamic equilibria.
- **Protocol Foundations**: Laboratory workflows (such as molecular cloning, cell transformation, PCR amplification, and electrophoretic separation) depend on precise ionic conditions (pH, $\\text{Mg}^{2+}$, salt concentrations) and temperature stability.

### 3. Practical Laboratory Recommendations
- Verify reagent stocks and calculate working solutions carefully before thawing sensitive enzymes.
- Incorporate appropriate experimental controls: positive controls to verify reaction competence and negative/no-template controls to monitor contamination.
- Record exact lot numbers, incubation times, and optical density ($A_{260}/A_{280}$) measurements in your laboratory notebook.

### 4. Key Limitations & Institutional Guidance
- Protocol parameters must be empirical adapted based on cell type, vector size, enzyme fidelity, and target GC content.
- Always consult your institution's Biosafety Manual, Standard Operating Procedures (SOPs), and enzyme manufacturer technical specifications.

### 5. Suggested Follow-Up Questions
- Would you like step-by-step guidance on setting up this calculation in the Quick Lab Calculator?
- Would you like to explore related CRISPR or molecular cloning references?`;
}

// In production, serve built frontend assets. In development, mount Vite middleware.
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BioAssist Pro server running on http://0.0.0.0:${PORT} (Production: ${isProduction})`);
  });
}

startServer();
