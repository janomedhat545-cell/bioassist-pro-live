import { ReferenceTopic } from '../types';

export const REFERENCE_TOPICS: ReferenceTopic[] = [
  // 1. CRISPR-Cas9
  {
    id: 'crispr-cas9',
    title: 'CRISPR-Cas9 System',
    category: 'CRISPR Fundamentals',
    difficulty: 'Beginner',
    shortDefinition: 'An RNA-guided endonuclease system adapted from bacterial adaptive immunity for targeted genomic double-strand cleavage.',
    definition: 'CRISPR-Cas9 (Clustered Regularly Interspaced Short Palindromic Repeats and CRISPR-associated protein 9) is a class 2, type II CRISPR system naturally found in bacteria such as Streptococcus pyogenes. It functions as an adaptive defense mechanism against bacteriophage infections, reprogrammed for targeted double-stranded DNA cleavage in biotechnology and biomedical research.',
    coreMechanism: 'SpCas9 scans genomic DNA for a conserved Protospacer Adjacent Motif (PAM: 5\'-NGG-3\'). Upon PAM binding, local DNA unwinds, allowing a 20-nucleotide single guide RNA (sgRNA) spacer to pair complementarily with the target protospacer strand. Upon stable R-loop formation, the HNH catalytic domain cuts the complementary strand while the RuvC-like domain cleaves the non-target strand, generating a blunt-ended double-strand break (DSB) 3 base pairs upstream of the PAM.',
    molecularComponents: [
      'SpCas9 Nuclease (1368 amino acids, contains HNH and RuvC domains)',
      'Single Guide RNA (sgRNA, ~100 nt synthetic fusion of crRNA and tracrRNA)',
      'Protospacer Adjacent Motif (PAM: 5\'-NGG-3\')',
      'Target genomic DNA duplex with complementary 20-nt protospacer sequence',
    ],
    scientificSignificance: 'Revolutionized reverse genetics, high-throughput functional genomics screens, preclinical disease modeling, and clinical therapeutic development for genetic hemoglobinopathies (e.g., sickle cell disease, beta-thalassemia).',
    commonTerminology: [
      { term: 'sgRNA', definition: 'Single guide RNA; chimeric RNA combining target-specific crRNA and Cas-binding tracrRNA.' },
      { term: 'PAM', definition: 'Protospacer Adjacent Motif; essential 2-6 bp sequence required for Cas protein binding.' },
      { term: 'DSB', definition: 'Double-strand break; simultaneous severance of both phosphodiester backbones in DNA.' },
      { term: 'R-loop', definition: 'Three-stranded nucleic acid structure where an RNA strand hybridizes with one DNA strand, displacing the other.' },
    ],
    educationalExamples: 'Disrupting the BCL11A erythroid enhancer via CRISPR-Cas9 (Casgevy therapy) to reactivate fetal hemoglobin (HbF) synthesis in sickle cell anemia and beta-thalassemia patients.',
    limitationsAndMisconceptions: [
      'Misconception: CRISPR-Cas9 performs the actual gene insertion. Reality: Cas9 only introduces the initial DNA cut; the host cell\'s endogenous repair pathways (NHEJ or HDR) determine the edit outcome.',
      'Cas9 cleavage can produce unintended off-target double-strand breaks at homologous genomic sites.',
      'Cleavage can stimulate p53 activation, selecting for p53-mutant clones in primary or stem cell cultures.',
    ],
    relatedTopicIds: ['guide-rna', 'pam-sequence', 'dna-repair', 'off-target-effects', 'base-editing'],
    suggestedAiQuestions: [
      'How does SpCas9 discriminate target DNA from bacterial self-DNA?',
      'What are the primary structural differences between SpCas9 and SaCas9?',
      'Why is PAM recognition required prior to RNA-DNA hybridization?',
    ],
    sources: [
      {
        title: 'A programmable dual-RNA-guided DNA endonuclease in adaptive bacterial immunity',
        source: 'Science',
        year: 2012,
        doi: '10.1126/science.1225829',
      },
      {
        title: 'Development and Applications of CRISPR-Cas9 for Genome Editing',
        source: 'Cell',
        year: 2014,
        doi: '10.1016/j.cell.2014.05.010',
      },
    ],
  },

  // 2. Guide RNA
  {
    id: 'guide-rna',
    title: 'Guide RNA (crRNA & tracrRNA)',
    category: 'CRISPR Fundamentals',
    difficulty: 'Intermediate',
    shortDefinition: 'The programmable RNA molecule that directs Cas endonucleases to precise complementary genomic target sites.',
    definition: 'Guide RNA directs CRISPR-associated endonucleases to specific DNA loci. In native type II bacterial systems, it exists as a dual-RNA complex composed of CRISPR RNA (crRNA) containing a 20-nucleotide spacer and trans-activating CRISPR RNA (tracrRNA) providing structural stability. For laboratory gene editing, these two components are engineered into a single guide RNA (sgRNA) transcript.',
    coreMechanism: 'The 5\' 20-nucleotide spacer region pairs via Watson-Crick base pairing with the complementary target DNA strand. The 3\' scaffold region forms distinct stem-loop hairpins (stem-loops 1, 2, and 3) that bind specifically to the bridge helix and REC (recognition) lobes of the Cas9 protein, aligning the target strand with the catalytic HNH pocket.',
    molecularComponents: [
      'Spacer sequence (20 nucleotides matching the genomic target)',
      'Repeat:anti-repeat duplex stem',
      'Tetraloop linker connecting crRNA and tracrRNA in synthetic sgRNA',
      'Stem-loop 1, 2, and 3 scaffolding motifs recognized by Cas9',
    ],
    scientificSignificance: 'Provides the modularity of CRISPR: changing the 20-nucleotide spacer redirects the nuclease to any genomic target without modifying the protein sequence, unlike earlier TALENs or Zinc Finger Nucleases.',
    commonTerminology: [
      { term: 'crRNA', definition: 'CRISPR RNA containing the variable spacer sequence derived from foreign DNA.' },
      { term: 'tracrRNA', definition: 'Trans-activating crRNA, a small non-coding RNA essential for crRNA maturation and Cas9 assembly.' },
      { term: 'Seed Region', definition: 'The 8-12 nucleotides of the guide RNA proximal to the PAM, where base pairing mismatches severely impair cleavage.' },
    ],
    educationalExamples: 'Designing an sgRNA against human VEGFA exon 3 with minimal predicted homology to the rest of the genome using in silico algorithms (e.g., CRISPOR or Benchling).',
    limitationsAndMisconceptions: [
      'G-rich or extremely high GC-content spacers (>75%) or very low GC (<30%) frequently exhibit poor cleavage efficiency.',
      'T-rich stretches (e.g., TTTT) act as transcription termination signals when expressed from standard human U6 RNA Polymerase III promoters.',
    ],
    relatedTopicIds: ['crispr-cas9', 'pam-sequence', 'off-target-effects'],
    suggestedAiQuestions: [
      'Why is the seed region of the guide RNA more sensitive to mismatches than the distal region?',
      'How do chemical modifications (e.g., 2\'-O-methyl, phosphorothioate) improve synthetic sgRNA stability in cells?',
    ],
    sources: [
      {
        title: 'Multiplex genome engineering using CRISPR/Cas systems',
        source: 'Science',
        year: 2013,
        doi: '10.1126/science.1231143',
      },
    ],
  },

  // 3. PAM Sequence
  {
    id: 'pam-sequence',
    title: 'PAM (Protospacer Adjacent Motif)',
    category: 'CRISPR Fundamentals',
    difficulty: 'Intermediate',
    shortDefinition: 'A mandatory short DNA motif flanking the target sequence required for Cas endonuclease binding and cleavage.',
    definition: 'The Protospacer Adjacent Motif (PAM) is a conserved 2–6 base pair sequence immediately adjacent to the protospacer target site in the host genome. In nature, the PAM serves as a self-versus-non-self discrimination mechanism: bacteriophages possess the PAM, while the host bacterial CRISPR array lacks it, preventing suicidal self-cleavage.',
    coreMechanism: 'Cas9 physically interrogates DNA through its C-terminal PAM-interacting (PI) domain before attempting to unwind the double helix. For SpCas9, the PI domain forms specific major-groove hydrogen bonds with two guanines in the 5\'-NGG-3\' sequence on the non-target strand. PAM recognition induces a conformational shift that initiates local DNA unwinding and R-loop nucleation.',
    molecularComponents: [
      'SpCas9 PAM-interacting (PI) domain (Arg1333 and Arg1335 forming base-specific contacts with guanines)',
      'Non-target DNA strand sequence motif (5\'-NGG-3\' for SpCas9; 5\'-TTTV-3\' for Cas12a/Cpf1; 5\'-NNGRRT-3\' for SaCas9)',
      'Phosphate lock loop stabilizing the unwound DNA backbone',
    ],
    scientificSignificance: 'Constrains targeting range (targetable genome window) while ensuring safety by preventing unintended spontaneous DNA cleavage. Engineered variants (e.g., SpRY, xCas9, Cas9-NG) expand targeting flexibility across PAM-depleted regions.',
    commonTerminology: [
      { term: 'NGG', definition: 'Standard PAM for Streptococcus pyogenes Cas9, where N is any nucleotide (A, C, G, T).' },
      { term: 'PAM-less editing', definition: 'Near-PAM-free genome editing enabled by engineered Cas variants like SpRY.' },
      { term: 'Self-cleavage avoidance', definition: 'Evolutionary adaptation preventing CRISPR nucleases from cutting the host bacterial spacer array.' },
    ],
    educationalExamples: 'When designing a guide RNA for human hemoglobin beta (HBB), an investigator searches for an adjacent 5\'-NGG-3\' on either the forward or reverse strand within 20 bp of the desired mutation locus.',
    limitationsAndMisconceptions: [
      'Misconception: The PAM sequence is included in the synthetic guide RNA. Reality: The PAM exists solely in the genomic DNA target and is NOT part of the sgRNA spacer.',
      'Different CRISPR enzymes require distinct PAM motifs (e.g., SpCas9 requires NGG at 3\'; Cas12a requires TTTV at 5\').',
    ],
    relatedTopicIds: ['crispr-cas9', 'guide-rna', 'base-editing', 'prime-editing'],
    suggestedAiQuestions: [
      'Why is SpCas9 PAM located at the 3\' end of the protospacer while Cas12a PAM is at the 5\' end?',
      'How does the engineered SpRY Cas9 variant achieve near-PAMless targeting?',
    ],
    sources: [
      {
        title: 'DNA interrogation by the CRISPR RNA-guided endonuclease Cas9',
        source: 'Nature',
        year: 2014,
        doi: '10.1038/nature13079',
      },
    ],
  },

  // 4. DNA Repair Pathways
  {
    id: 'dna-repair',
    title: 'DNA Repair (NHEJ vs HDR)',
    category: 'DNA Repair',
    difficulty: 'Intermediate',
    shortDefinition: 'Endogenous cellular repair pathways that resolve DNA double-strand breaks, dictating gene knockout versus gene insertion.',
    definition: 'Following Cas-induced DNA cleavage, eukaryotic cells repair double-strand breaks through two primary competing pathways: Non-Homologous End Joining (NHEJ) and Homology-Directed Repair (HDR). The balance between these mechanisms dictates whether gene disruption (knockout) or precise sequence insertion/correction occurs.',
    coreMechanism: 'NHEJ: Operates throughout all cell cycle phases (G0, G1, S, G2). The Ku70/Ku80 heterodimer binds DNA ends, recruiting DNA-PKcs, Artemis, and DNA Ligase IV/XRCC4. Ends are ligated without an exogenous template, frequently creating small insertions or deletions (indels) that cause frameshift mutations. HDR: Active predominantly during S and G2 phases when sister chromatids exist. End resection by the MRN complex and CtIP exposes 3\' single-stranded DNA overhangs coated by RPA, replaced by RAD51. RAD51 catalyzes strand invasion into a homologous donor template, enabling precise sequence repair.',
    molecularComponents: [
      'NHEJ machinery: Ku70/80 heterodimer, DNA-PKcs, Artemis endonuclease, XRCC4-DNA Ligase IV',
      'HDR machinery: MRN complex (Mre11-Rad50-Nbs1), CtIP, Exo1, RPA, RAD51 recombinase',
      'Donor DNA template (ssODN or plasmid with homology arms) for HDR',
    ],
    scientificSignificance: 'NHEJ is the primary mechanism for therapeutic gene knockouts (functional disruption). HDR enables precise gene corrections, tag insertions (e.g., GFP, FLAG), and single-nucleotide disease variant fixes.',
    commonTerminology: [
      { term: 'Indel', definition: 'Insertion or deletion of bases resulting in frameshifts and premature stop codons (nonsense-mediated decay).' },
      { term: 'ssODN', definition: 'Single-stranded oligodeoxynucleotide used as an efficient donor template for HDR.' },
      { term: 'Homology Arms', definition: 'Flanking DNA sequences identical to the cut site required for HDR template recognition (typically 50-800 bp).' },
    ],
    educationalExamples: 'Generating a knockout cell line by targeting exon 2 of a kinase: NHEJ creates a 2-bp deletion causing a frameshift and premature termination codon.',
    limitationsAndMisconceptions: [
      'HDR efficiency in mammalian cells is typically low (5-20%) compared to predominant NHEJ (>70%).',
      'HDR is virtually inactive in non-dividing (quiescent G0/G1) cells such as adult neurons or cardiomyocytes.',
    ],
    relatedTopicIds: ['crispr-cas9', 'base-editing', 'prime-editing', 'somatic-mutations'],
    suggestedAiQuestions: [
      'What chemical or genetic strategies can shift the repair pathway balance from NHEJ toward HDR?',
      'Why is microhomology-mediated end joining (MMEJ) considered distinct from canonical NHEJ?',
    ],
    sources: [
      {
        title: 'Double-strand break repair, salvage, and mutagenesis in mammalian cells',
        source: 'Cell Research',
        year: 2018,
        doi: '10.1038/s41422-018-0051-5',
      },
    ],
  },

  // 5. Off-Target Effects
  {
    id: 'off-target-effects',
    title: 'Off-Target Effects & Specificity',
    category: 'CRISPR Fundamentals',
    difficulty: 'Advanced',
    shortDefinition: 'Unintended genomic cleavage events caused by partial sequence homology between the guide RNA and non-target loci.',
    definition: 'Off-target effects occur when CRISPR nucleases cleave unintended genomic sequences sharing partial sequence similarity with the guide RNA spacer. Such events risk causing unintended gene disruptions, chromosomal translocations, or activation of oncogenes.',
    coreMechanism: 'Cas9 tolerates nucleotide mismatches, particularly at the 5\' distal region (positions 12–20 away from the PAM) of the guide RNA. While the proximal "seed" sequence (positions 1–10) is stringent, energetic excess in standard Cas9 facilitates non-specific cleavage. Unintended double-strand breaks at multiple loci simultaneously can lead to reciprocal chromosomal translocations.',
    molecularComponents: [
      'High-fidelity engineered Cas variants (e.g., SpCas9-HF1, eSpCas9, HypaCas9, Cas9-HiFi)',
      'Nickase Cas9 (nCas9) requiring paired cooperative nicking for DSB creation',
      'Unbiased detection assays: GUIDE-seq, CIRCLE-seq, DISCOVER-seq, Digenome-seq',
    ],
    scientificSignificance: 'Evaluating and minimizing off-target mutations is the central safety requirement for preclinical gene editing pipelines and regulatory IND approval by FDA and EMA.',
    commonTerminology: [
      { term: 'GUIDE-seq', definition: 'Genome-wide, Unbiased Identification of DSBs Enabled by Sequencing; captures blunt DSBs using dsODN tags.' },
      { term: 'Chromosomal Translocation', definition: 'Recombination between two distinct chromosomes caused by concurrent double-strand breaks.' },
      { term: 'Nickase', definition: 'Cas9 variant with one inactivated catalytic domain (e.g., D10A or H840A) creating single-strand nicks instead of DSBs.' },
    ],
    educationalExamples: 'Screening an anti-sickle cell sgRNA using GUIDE-seq to confirm that off-target cleavage at homologous genomic loci remains below the limit of detection (<0.1%).',
    limitationsAndMisconceptions: [
      'In silico prediction algorithms (e.g., CFD score, MIT score) identify predicted sites but frequently miss cell-type-specific chromatin accessibility and non-canonical PAM off-targets.',
    ],
    relatedTopicIds: ['crispr-cas9', 'guide-rna', 'pam-sequence', 'base-editing'],
    suggestedAiQuestions: [
      'How does paired nickase Cas9 (D10A) increase targeting specificity compared to wild-type Cas9?',
      'What are the advantages of GUIDE-seq over targeted deep amplicon sequencing?',
    ],
    sources: [
      {
        title: 'GUIDE-seq enables genome-wide profiling of off-target cleavage by CRISPR-Cas nucleases',
        source: 'Nature Biotechnology',
        year: 2015,
        doi: '10.1038/nbt.3117',
      },
    ],
  },

  // 6. Base Editing
  {
    id: 'base-editing',
    title: 'Base Editing (CBEs & ABEs)',
    category: 'CRISPR Fundamentals',
    difficulty: 'Advanced',
    shortDefinition: 'Precision single-nucleotide transition editing without creating double-strand breaks or requiring donor templates.',
    definition: 'Base editing is a programmable genome editing method that directly converts one target nucleotide base into another without introducing double-strand DNA breaks (DSBs) or requiring donor DNA templates. Invented in David Liu\'s laboratory, base editors engineer transitions (C→T and A→G).',
    coreMechanism: 'Cytosine Base Editors (CBEs): A cytidine deaminase (e.g., rAPOBEC1) fused to catalytically impaired Cas9 nickase (nCas9 D10A) and a Uracil DNA Glycosylase Inhibitor (UGI). Upon R-loop formation, cytidine is deaminated to uridine (U). UGI prevents cellular uracil excision repair. The nCas9 nicks the non-edited strand, directing DNA polymerase to resynthesize it with adenine, converting C-G to T-A. Adenine Base Editors (ABEs): Utilize an engineered laboratory-evolved deoxyadenosine deaminase (TadA-8e) to convert adenine to inosine (I). Cellular polymerase reads inosine as guanine (G), converting A-T to G-C.',
    molecularComponents: [
      'Cas9 Nickase (nCas9 D10A)',
      'Cytidine Deaminase (e.g., APOBEC1) or Deoxyadenosine Deaminase (evolved TadA)',
      'Uracil Glycosylase Inhibitor (UGI peptide for CBEs)',
      'Narrow catalytic editing window (typically 4-5 nt within the protospacer, e.g., protospacer positions 4-8)',
    ],
    scientificSignificance: 'Over 50% of known pathogenic human genetic variants are point mutations. Base editing fixes point mutations in post-mitotic and dividing cells with high efficiency (>50%) and minimal indel formation (<1%).',
    commonTerminology: [
      { term: 'CBE', definition: 'Cytosine Base Editor; converts C-G base pairs to T-A.' },
      { term: 'ABE', definition: 'Adenine Base Editor; converts A-T base pairs to G-C.' },
      { term: 'Bystander Editing', definition: 'Unintended editing of adjacent identical bases within the deaminase catalytic window.' },
    ],
    educationalExamples: 'Correcting the pathogenic G→A point mutation responsible for progeria in animal models without double-strand break toxicity.',
    limitationsAndMisconceptions: [
      'Only performs nucleotide transitions (purine to purine, pyrimidine to pyrimidine); cannot perform transversions (e.g., C to G, A to T) or insertions/deletions.',
      'Susceptible to bystander edits if multiple identical bases lie within the editing window.',
    ],
    relatedTopicIds: ['crispr-cas9', 'prime-editing', 'dna-repair', 'somatic-mutations'],
    suggestedAiQuestions: [
      'Why was directed evolution necessary to create the first Adenine Base Editor?',
      'How does UGI prevent base excision repair from converting uridine back to cytosine?',
    ],
    sources: [
      {
        title: 'Programmable editing of a target base in genomic DNA without double-stranded DNA cleavage',
        source: 'Nature',
        year: 2016,
        doi: '10.1038/nature17946',
      },
      {
        title: 'Programmable base editing of A•T to G•C in genomic DNA without DNA cleavage',
        source: 'Nature',
        year: 2017,
        doi: '10.1038/nature24644',
      },
    ],
  },

  // 7. Prime Editing
  {
    id: 'prime-editing',
    title: 'Prime Editing',
    category: 'CRISPR Fundamentals',
    difficulty: 'Advanced',
    shortDefinition: 'A search-and-replace gene editing technology using an engineered reverse transcriptase and prime editing guide RNA.',
    definition: 'Prime editing is a versatile genome editing method that can perform all 12 types of point mutations (transitions and transversions) as well as targeted insertions (up to ~100 bp) and deletions (up to ~80 bp) without requiring double-strand DNA breaks or donor repair templates.',
    coreMechanism: 'Combines an engineered Moloney Murine Leukemia Virus reverse transcriptase (M-MLV RT) fused to Cas9 H840A nickase, guided by an extended prime editing guide RNA (pegRNA). The pegRNA contains: (1) a 20-nt spacer, (2) a Primer Binding Site (PBS), and (3) an RT template containing the desired edit. Upon nicking the PAM-containing strand, the PBS hybridizes with the liberated 3\' DNA flap. The RT domain copies the template into new genomic DNA. Cellular flap equilibration and mismatch repair incorporate the edited flap permanently into the duplex.',
    molecularComponents: [
      'Prime Editor enzyme: Cas9 H840A nickase fused to engineered M-MLV Reverse Transcriptase',
      'pegRNA: Guide RNA with 3\' extensions (Primer Binding Site and Reverse Transcription Template)',
      'Secondary nicking sgRNA (in PE3 system) to drive cellular repair toward the edited strand',
    ],
    scientificSignificance: 'Greatly expands programmable editing scope beyond base editing constraints, allowing precise multi-base insertions, deletions, and transversions with minimal byproduct formation.',
    commonTerminology: [
      { term: 'pegRNA', definition: 'Prime editing guide RNA; provides targeting and template synthesis information.' },
      { term: 'PBS', definition: 'Primer Binding Site; binds the single-stranded 3\' DNA flap generated by nicking.' },
      { term: 'Flap Equilibrium', definition: 'Competition between endogenous 5\' unedited flap and 3\' edited flap resolution by FEN1 flap endonuclease.' },
    ],
    educationalExamples: 'Targeted 3-bp insertion (CTT) to correct the common ΔF508 deletion in the cystic fibrosis transmembrane conductance regulator (CFTR) gene.',
    limitationsAndMisconceptions: [
      'Requires extensive optimization of PBS length (typically 12-16 nt) and RT template length (10-20 nt) for each unique genomic target.',
      'Larger molecular payload compared to standard Cas9 complicates packaging into size-limited viral delivery vectors like adeno-associated virus (AAV).',
    ],
    relatedTopicIds: ['crispr-cas9', 'base-editing', 'dna-repair', 'plasmids-vectors'],
    suggestedAiQuestions: [
      'What is the difference between PE2, PE3, and PE-max systems?',
      'Why does prime editing yield significantly lower indel rates than conventional HDR?',
    ],
    sources: [
      {
        title: 'Search-and-replace genome editing without double-strand breaks or donor DNA',
        source: 'Nature',
        year: 2019,
        doi: '10.1038/s41586-019-1711-4',
      },
    ],
  },

  // 8. Plasmids and Vectors
  {
    id: 'plasmids-vectors',
    title: 'Plasmids & Cloning Vectors',
    category: 'Genetic Engineering',
    difficulty: 'Beginner',
    shortDefinition: 'Extrachromosomal DNA constructs used to clone, propagate, manipulate, and express genes in host organisms.',
    definition: 'Plasmids are autonomous, extrachromosomal circular double-stranded DNA molecules found in bacteria and yeast. Engineered plasmids (cloning and expression vectors) are molecular workhorses used to propagate recombinant DNA sequences, produce proteins, and deliver gene editing cargos.',
    coreMechanism: 'A functional cloning vector contains: (1) Origin of Replication (ori) determining host compatibility and copy number; (2) Selectable Marker (e.g., ampicillin, kanamycin, puromycin resistance) ensuring only plasmid-bearing cells survive antibiotic selection; (3) Multiple Cloning Site (MCS) containing unique restriction endonuclease recognition sequences; and (4) Promoter/Terminator cassettes (e.g., T7, CMV, U6) driving RNA and protein expression.',
    molecularComponents: [
      'Bacterial origin of replication (e.g., pUC high copy, pBR322 medium copy)',
      'Antibiotic resistance cassette (e.g., beta-lactamase for ampicillin, aminoglycoside 3\'-phosphotransferase for kanamycin)',
      'Multiple Cloning Site (polylinker)',
      'Transcriptional promoter (e.g., bacteriophage T7, CMV, EF1a, U6)',
    ],
    scientificSignificance: 'Foundational tool for recombinant biotechnology, synthetic biology, molecular cloning, monoclonal antibody production, and cell therapy vector generation.',
    commonTerminology: [
      { term: 'Origin of Replication (ori)', definition: 'DNA sequence where host replication machinery initiates plasmid copying.' },
      { term: 'Multiple Cloning Site (MCS)', definition: 'Synthetically clustered region with unique restriction enzyme recognition sites.' },
      { term: 'Copy Number', definition: 'Average number of plasmid copies maintained per host cell (e.g., high-copy >500; low-copy ~15-20).' },
    ],
    educationalExamples: 'Using a pUC19 vector to clone human insulin cDNA for propagation in Escherichia coli DH5alpha.',
    limitationsAndMisconceptions: [
      'High-copy plasmids can cause metabolic burden and plasmid loss in large-scale industrial fermentation without continuous antibiotic selection.',
    ],
    relatedTopicIds: ['recombinant-dna', 'gene-cloning', 'molecular-cloning', 'genetic-transformation'],
    suggestedAiQuestions: [
      'How does the rop gene regulate plasmid copy number in ColE1-derived vectors?',
      'What are the advantages of lentiviral vectors over standard circular plasmid transfection for hard-to-transfect primary cells?',
    ],
    sources: [
      {
        title: 'Molecular Cloning: A Laboratory Manual',
        source: 'Cold Spring Harbor Laboratory Press',
        year: 2012,
      },
    ],
  },

  // 9. Recombinant DNA
  {
    id: 'recombinant-dna',
    title: 'Recombinant DNA Technology',
    category: 'Genetic Engineering',
    difficulty: 'Intermediate',
    shortDefinition: 'The artificial joining of DNA segments from different biological sources to create novel genetic combinations.',
    definition: 'Recombinant DNA (rDNA) technology encompasses laboratory techniques that join genetic material from multiple sources into a single DNA molecule. Pioneered by Paul Berg, Herbert Boyer, and Stanley Cohen in the 1970s, it forms the foundation of modern red, white, and green biotechnology.',
    coreMechanism: 'Recombinant molecules are constructed through: (1) Cleavage of source DNA and vector DNA with restriction endonucleases; (2) Purification of fragments; (3) Covalent phosphodiester bond formation between 5\'-phosphate and 3\'-hydroxyl termini using T4 DNA Ligase; or (4) Isothermal sequence-overlap assembly (Gibson Assembly).',
    molecularComponents: [
      'Restriction Endonucleases (Type II enzymes recognizing palindromic sequences)',
      'T4 DNA Ligase (ATP-dependent phosphodiester bond synthesizer)',
      'Target insert cDNA or genomic fragment',
      'Recipient vector backbone',
    ],
    scientificSignificance: 'Enabled commercial biosynthesis of recombinant human therapeutics (insulin, human growth hormone, erythropoietin, clotting factors) replacing animal tissue extraction.',
    commonTerminology: [
      { term: 'Cohesive (Sticky) Ends', definition: 'Single-stranded overhangs produced by staggered restriction enzyme cleavage that facilitate selective base pairing.' },
      { term: 'Blunt Ends', definition: 'Non-overhanging double-stranded DNA ends produced by symmetric cleavage enzymes (e.g., EcoRV, SmaI).' },
      { term: 'T4 DNA Ligase', definition: 'Bacteriophage enzyme that seals nicks in double-stranded DNA by forming covalent phosphodiester bonds.' },
    ],
    educationalExamples: 'Ligating a human growth hormone gene into a bacterial plasmid backbone cut with EcoRI and HindIII.',
    limitationsAndMisconceptions: [
      'Vector self-ligation is a major source of background colonies; treating vector ends with alkaline phosphatase (CIP, SAP) prevents self-ligation.',
    ],
    relatedTopicIds: ['plasmids-vectors', 'gene-cloning', 'molecular-cloning', 'pcr'],
    suggestedAiQuestions: [
      'Why is calf intestinal alkaline phosphatase (CIP) used during vector preparation for sticky-end cloning?',
      'How does Gibson Assembly join overlapping DNA fragments in a single isothermal reaction?',
    ],
    sources: [
      {
        title: 'Enzymatic assembly of DNA molecules up to several hundred kilobases',
        source: 'Nature Methods',
        year: 2009,
        doi: '10.1038/nmeth.1318',
      },
    ],
  },

  // 10. Gene Cloning
  {
    id: 'gene-cloning',
    title: 'Gene Cloning & Amplification',
    category: 'Genetic Engineering',
    difficulty: 'Beginner',
    shortDefinition: 'The process of isolating a specific gene sequence and producing identical copies inside a host biological system.',
    definition: 'Gene cloning involves inserting a target gene into a replicable vector, transferring the construct into a host cell (e.g., E. coli), and propagating single colonies to produce identical copies of the DNA sequence for analysis or expression.',
    coreMechanism: 'Steps: (1) Target gene isolation via PCR; (2) Vector digestion and insert-vector ligation; (3) Transformation of competent host cells; (4) Antibiotic selection on agar plates; (5) Colony screening (colony PCR, blue-white screening, or restriction digest); (6) High-fidelity plasmid extraction and sequence validation via Sanger sequencing.',
    molecularComponents: [
      'Competent cells (chemically competent or electrocompetent E. coli)',
      'Selective agar media (e.g., LB agar + antibiotic)',
      'Verification primers for colony PCR',
      'Miniprep silica-column reagents for plasmid DNA purification',
    ],
    scientificSignificance: 'Enables precise isolation, physical manipulation, mutation analysis, and structural biology characterization of any gene from any organism.',
    commonTerminology: [
      { term: 'Blue-White Screening', definition: 'Visual selection where functional lacZ alpha-complementation metabolizes X-gal into a blue pigment; successful insert disruption yields white colonies.' },
      { term: 'Colony PCR', definition: 'Direct PCR amplification from a picked bacterial colony to verify insert presence and orientation.' },
    ],
    educationalExamples: 'Cloning human p53 cDNA into a pET-28a bacterial expression vector to produce His-tagged p53 protein for biochemical binding assays.',
    limitationsAndMisconceptions: [
      'Colony PCR can yield false positives due to carryover residual ligation template; Sanger sequencing remains the gold standard for confirmation.',
    ],
    relatedTopicIds: ['plasmids-vectors', 'recombinant-dna', 'molecular-cloning', 'genetic-transformation'],
    suggestedAiQuestions: [
      'How does alpha-complementation work in blue-white screening?',
      'What are the troubleshooting steps when no bacterial colonies grow after transformation?',
    ],
    sources: [
      {
        title: 'Principles of Gene Manipulation and Genomics',
        source: 'Blackwell Publishing',
        year: 2006,
      },
    ],
  },

  // 11. Gene Expression
  {
    id: 'gene-expression',
    title: 'Gene Expression & Regulation',
    category: 'Gene Expression',
    difficulty: 'Intermediate',
    shortDefinition: 'The molecular process by which DNA information is transcribed into RNA and translated into functional cellular proteins.',
    definition: 'Gene expression is the multi-step biochemical process through which genomic sequence information directs synthesis of functional gene products, primarily messenger RNA (mRNA) and functional proteins. It encompasses transcriptional initiation, RNA processing, translation, and post-translational modification.',
    coreMechanism: 'Transcription: RNA Polymerase II binds promoter regions (assisted by general transcription factors and enhancers) to transcribe pre-mRNA. RNA Processing: 5\' 7-methylguanosine capping, spliceosome-mediated intron excision, and 3\' polyadenylation. Translation: Ribosomes translate mature mRNA into polypeptide chains via aminoacyl-tRNAs in the cytoplasm.',
    molecularComponents: [
      'Promoters, enhancers, silencers, and locus control regions',
      'RNA Polymerase II and basal transcription factors (TFIID, TFIIB, TFIIH)',
      'Spliceosome snRNPs (U1, U2, U4, U5, U6)',
      '80S Ribosome complex (40S and 60S eukaryotic subunits)',
    ],
    scientificSignificance: 'Understanding gene expression control underlies cancer diagnostics, recombinant biomanufacturing yields, and synthetic genetic circuit design in synthetic biology.',
    commonTerminology: [
      { term: 'Transcription Factor', definition: 'Sequence-specific DNA-binding protein regulating the recruitment of RNA polymerase.' },
      { term: 'Enhancer', definition: 'Distal regulatory DNA element that enhances transcription frequency regardless of orientation.' },
      { term: 'Alternative Splicing', definition: 'Differential exon inclusion creating multiple distinct mRNA isoforms from a single pre-mRNA transcript.' },
    ],
    educationalExamples: 'Induction of the lac operon with IPTG (isopropyl beta-D-1-thiogalactopyranoside) to drive high-yield recombinant protein expression in E. coli BL21(DE3).',
    limitationsAndMisconceptions: [
      'Misconception: mRNA levels always correlate 1:1 with protein levels. Reality: Translational efficiency, codon bias, protein half-life, and degradation heavily influence final protein abundance.',
    ],
    relatedTopicIds: ['oncogenes-tumor-suppressors', 'rt-pcr-qpcr', 'rna-interference'],
    suggestedAiQuestions: [
      'How does the LacI repressor protein interact with the lac operator sequence in IPTG induction?',
      'What epigenetic modifications (DNA methylation, histone acetylation) repress eukaryotic gene expression?',
    ],
    sources: [
      {
        title: 'Molecular Biology of the Cell',
        source: 'Garland Science',
        year: 2022,
      },
    ],
  },

  // 12. Genetic Transformation
  {
    id: 'genetic-transformation',
    title: 'Genetic Transformation & Transfection',
    category: 'Genetic Engineering',
    difficulty: 'Intermediate',
    shortDefinition: 'Methods for introducing exogenous foreign genetic material into bacterial, yeast, or mammalian cells.',
    definition: 'Transformation (in bacteria/yeast) and transfection/transduction (in mammalian cells) describe the laboratory introduction of foreign nucleic acids across cellular membranes to alter cell genotype and phenotype.',
    coreMechanism: 'Methods include: (1) Chemical transformation (CaCl2 treatment creates membrane pores; 42°C heat-shock induces DNA uptake); (2) Electroporation (brief high-voltage electrical pulse creates transient membrane pores); (3) Cationic lipid transfection (liposomes encapsulate negative DNA and fuse with plasma membrane); and (4) Viral transduction (lentivirus, retrovirus, AAV deliver genetic payload via receptor-mediated entry).',
    molecularComponents: [
      'Competent cells (calcium-chloride treated or electrocompetent)',
      'Cationic lipid reagents (e.g., Lipofectamine)',
      'Electroporation cuvettes and pulse generators',
      'Viral packaging plasmids (gag-pol, rev, VSV-G envelope for pseudotyping)',
    ],
    scientificSignificance: 'Critical prerequisite for recombinant cloning, CRISPR ribonucleoprotein (RNP) delivery, functional protein expression, and CAR-T cell manufacturing.',
    commonTerminology: [
      { term: 'Transfection', definition: 'Non-viral delivery of nucleic acids into eukaryotic cells.' },
      { term: 'Transduction', definition: 'Virus-mediated introduction of genetic material into host cells.' },
      { term: 'Competency', definition: 'Physiological state permitting a bacterial cell to take up exogenous DNA from its environment.' },
    ],
    educationalExamples: 'Electroporating Cas9-sgRNA ribonucleoprotein (RNP) complexes into human primary T cells for ex vivo cancer immunotherapy engineering.',
    limitationsAndMisconceptions: [
      'Chemical heat-shock is inefficient for large constructs (>15 kb); electroporation or viral delivery is preferred.',
      'Cationic liposomes frequently induce significant cytotoxicity in sensitive primary cell populations.',
    ],
    relatedTopicIds: ['plasmids-vectors', 'gene-cloning', 'crispr-cas9'],
    suggestedAiQuestions: [
      'Why does heat shock at 42°C followed by immediate return to ice facilitate DNA entry in bacteria?',
      'What are the advantages of Cas9 RNP electroporation over plasmid transfection in primary human cells?',
    ],
    sources: [
      {
        title: 'High-efficiency transformation of Escherichia coli by high voltage electroporation',
        source: 'Nucleic Acids Research',
        year: 1988,
        doi: '10.1093/nar/16.13.6127',
      },
    ],
  },

  // 13. PCR
  {
    id: 'pcr',
    title: 'Polymerase Chain Reaction (PCR)',
    category: 'Laboratory Techniques',
    difficulty: 'Beginner',
    shortDefinition: 'An enzymatic method for exponential in vitro amplification of specific target DNA sequences.',
    definition: 'Invented by Kary Mullis in 1983, the Polymerase Chain Reaction (PCR) is an in vitro technique that exponentially amplifies a designated target DNA segment from trace template amounts using cyclical temperature changes and a thermostable DNA polymerase.',
    coreMechanism: 'Repeated cyclical steps (typically 25–35 cycles): (1) Denaturation (95°C): Heat breaks hydrogen bonds, separating double-stranded DNA into single strands; (2) Annealing (50–65°C): Synthetic oligonucleotide primers anneal complementarily to flanking sequences; (3) Extension (72°C): Thermostable polymerase (e.g., Taq or high-fidelity Pfu/Q5) synthesizes nascent DNA 5\' to 3\' by incorporating dNTPs. Theoretical yield = $2^n$ copies.',
    molecularComponents: [
      'Template DNA',
      'Forward and Reverse oligonucleotide primers (typically 18-24 nt, Tm ~55-65°C)',
      'Thermostable DNA Polymerase (e.g., Taq, Phusion, Q5)',
      'Deoxynucleotide triphosphates (dNTP mix: dATP, dCTP, dGTP, dTTP)',
      'Reaction buffer with MgCl2 (essential divalent cofactor for polymerase activity)',
    ],
    scientificSignificance: 'Indispensable cornerstone across molecular diagnostics, forensic DNA profiling, pathogen detection, cloning, and genomic library preparation.',
    commonTerminology: [
      { term: 'Annealing Temperature (Ta)', definition: 'Incubation temperature chosen based on primer melting temperature (typically Ta = Tm - 3 to 5°C).' },
      { term: 'Melting Temperature (Tm)', definition: 'Temperature at which 50% of the primer-template duplex is dissociated.' },
      { term: 'Fidelity', definition: 'Accuracy of nucleotide incorporation; high-fidelity enzymes possess 3\' to 5\' exonuclease proofreading activity.' },
    ],
    educationalExamples: 'Amplifying a 500-bp region of the human TP53 gene from genomic DNA for mutation analysis using a standard 3-step thermal cycling protocol.',
    limitationsAndMisconceptions: [
      'Standard Taq polymerase lacks 3\'→5\' proofreading exonuclease activity and has an error rate of ~1 in 10,000 bp; high-fidelity polymerases (Q5, KAPA) are required for sequencing/cloning.',
      'GC-rich templates (>65% GC) form stable secondary hairpin structures; DMSO or betaine cosolvents are needed to prevent polymerase stalling.',
    ],
    relatedTopicIds: ['rt-pcr-qpcr', 'gel-electrophoresis', 'molecular-cloning', 'dna-sequencing'],
    suggestedAiQuestions: [
      'How does magnesium ion concentration (Mg2+) affect PCR fidelity and yield?',
      'Why do high-fidelity polymerases with 3\'→5\' exonuclease activity require modified phosphorothioate primers in certain assays?',
    ],
    sources: [
      {
        title: 'Primer-directed enzymatic amplification of DNA with a thermostable DNA polymerase',
        source: 'Science',
        year: 1988,
        doi: '10.1126/science.2448875',
      },
    ],
  },

  // 14. RT-PCR and qPCR
  {
    id: 'rt-pcr-qpcr',
    title: 'RT-PCR & Quantitative PCR (qPCR)',
    category: 'Laboratory Techniques',
    difficulty: 'Intermediate',
    shortDefinition: 'Techniques for measuring RNA transcript levels and quantifying DNA template copy numbers in real time.',
    definition: 'Reverse Transcription PCR (RT-PCR) couples RNA reverse transcription with PCR. Quantitative real-time PCR (qPCR) monitors fluorescent signal generation during PCR cycling to measure the exact starting concentration of target nucleic acid templates.',
    coreMechanism: 'RT: Reverse transcriptase (e.g., M-MLV) copies RNA into cDNA using oligo(dT), random hexamers, or gene-specific primers. qPCR Chemistry: (A) SYBR Green I binds double-stranded DNA minor grooves, emitting fluorescence proportional to dsDNA mass; (B) TaqMan probes contain a 5\' reporter fluorophore and 3\' quencher. As Taq extends, its 5\'→3\' exonuclease cleaves the probe, releasing reporter fluorescence. Quantification: Cycle threshold (Ct) is the cycle where fluorescence exceeds background threshold. Relative quantification uses the comparative ΔΔCt method.',
    molecularComponents: [
      'Reverse Transcriptase (e.g., SuperScript IV, M-MLV)',
      'cDNA template or mRNA',
      'SYBR Green dye or dual-labeled fluorogenic TaqMan hydrolysis probe',
      'Reference/Housekeeping gene primers (e.g., GAPDH, ACTB, 18S rRNA) for normalisation',
    ],
    scientificSignificance: 'Clinical gold standard for viral pathogen diagnostics (SARS-CoV-2, HIV viral load), cancer biomarker expression profiling, and validating CRISPR gene knockout efficiency.',
    commonTerminology: [
      { term: 'Ct / Cq Value', definition: 'Cycle threshold / quantification cycle; inversely proportional to log2 of initial template copy number.' },
      { term: 'ΔΔCt Method', definition: 'Livak method for relative gene expression calculation: Fold Change = 2^(-ΔΔCt).' },
      { term: 'Melt Curve Analysis', definition: 'Thermal dissociation profile confirming single-product amplification in SYBR Green assays.' },
    ],
    educationalExamples: 'Measuring fold-induction of the PD-L1 (CD274) gene in melanoma cells following interferon-gamma stimulation using the 2^(-ΔΔCt) method relative to GAPDH.',
    limitationsAndMisconceptions: [
      'SYBR Green binds any double-stranded DNA non-specifically, including primer-dimers; always run a post-PCR melting curve to verify single peak specificity.',
      'Always include No-RT and No-Template Controls (NTC) to rule out genomic DNA contamination and reagent carryover.',
    ],
    relatedTopicIds: ['pcr', 'gene-expression', 'gel-electrophoresis', 'cancer-biomarkers'],
    suggestedAiQuestions: [
      'How does the comparative ΔΔCt method calculate relative fold change in gene expression?',
      'Why is a No-Reverse-Transcription (No-RT) control required when preparing cDNA for qPCR?',
    ],
    sources: [
      {
        title: 'Analysis of relative gene expression data using real-time quantitative PCR and the 2(-Delta Delta C(T)) Method',
        source: 'Methods',
        year: 2001,
        doi: '10.1006/meth.2001.1262',
      },
    ],
  },

  // 15. Gel Electrophoresis
  {
    id: 'gel-electrophoresis',
    title: 'Gel Electrophoresis',
    category: 'Laboratory Techniques',
    difficulty: 'Beginner',
    shortDefinition: 'Separation of nucleic acids or proteins based on molecular size and charge using an electric field.',
    definition: 'Gel electrophoresis is an analytical and preparative technique used to separate charged macromolecules (DNA, RNA, proteins) through a porous polymer matrix under the influence of an applied electric field.',
    coreMechanism: 'Because DNA and RNA possess a uniform negative charge-to-mass ratio along their phosphodiester backbones, fragments migrate toward the positive anode (red electrode). The agarose gel network acts as a molecular sieve: smaller fragments navigate pores faster, migrating further down the gel than larger fragments. For proteins (SDS-PAGE), sodium dodecyl sulfate denatures proteins and confers uniform negative charge proportional to length.',
    molecularComponents: [
      'Agarose matrix (0.7% to 2.0% depending on DNA fragment size range) or Polyacrylamide',
      'Electrophoresis running buffer (TAE for resolution of large fragments, TBE for small fragments <1 kb)',
      'Fluorescent DNA stain (GelRed, SYBR Safe, or ethidium bromide)',
      'DNA molecular weight ladder',
      'Glycerol/Ficoll loading buffer with tracking dyes (Bromophenol Blue, Xylene Cyanol)',
    ],
    scientificSignificance: 'Standard diagnostic verification for PCR amplification success, restriction digest completion, RNA integrity (28S/18S ribosomal band ratio), and DNA fragment gel extraction for downstream cloning.',
    commonTerminology: [
      { term: 'TAE vs TBE Buffer', definition: 'TAE (Tris-Acetate-EDTA) has lower buffering capacity but allows easy DNA gel extraction; TBE provides sharper resolution for small fragments.' },
      { term: 'Gel Extraction', definition: 'Excising a specific DNA band from an agarose gel and purifying it using silica-spin columns.' },
    ],
    educationalExamples: 'Resolving a 350-bp PCR amplicon alongside a 100-bp ladder on a 1.5% agarose gel stained with GelRed to confirm specific product formation.',
    limitationsAndMisconceptions: [
      'Supercoiled, relaxed circular, and linear plasmid forms migrate at different rates despite having identical molecular weight.',
    ],
    relatedTopicIds: ['pcr', 'rt-pcr-qpcr', 'recombinant-dna', 'molecular-cloning'],
    suggestedAiQuestions: [
      'Why do circular, nicked, and linear plasmid forms migrate differently on an agarose gel?',
      'How does agarose concentration affect the resolution of different DNA size fragments?',
    ],
    sources: [
      {
        title: 'Molecular Cloning: Agarose Gel Electrophoresis Protocols',
        source: 'Cold Spring Harbor Protocols',
        year: 2014,
      },
    ],
  },

  // 16. DNA Sequencing
  {
    id: 'dna-sequencing',
    title: 'DNA Sequencing (Sanger to NGS)',
    category: 'Laboratory Techniques',
    difficulty: 'Intermediate',
    shortDefinition: 'Methods used to determine the exact sequential order of nucleotide bases (A, C, G, T) in a DNA molecule.',
    definition: 'DNA sequencing determines the precise nucleotide sequence of DNA molecules. Technologies span first-generation chain-termination Sanger sequencing, second-generation high-throughput Next-Generation Sequencing (Illumina short-read), and third-generation long-read sequencing (Pacific Biosciences, Oxford Nanopore).',
    coreMechanism: 'Sanger Sequencing: In vitro DNA synthesis incorporating fluorescently labeled 2\',3\'-dideoxynucleotide triphosphates (ddNTPs). Lacking a 3\'-OH group, ddNTPs terminate chain extension at specific bases. Fragments are separated by capillary electrophoresis with laser fluorescence detection. Illumina NGS: Clonal amplification (bridge PCR or patterned flow-cell clustering) followed by cyclic reversible dye-terminator sequencing-by-synthesis. Nanopore: Measures electrical current fluctuations as single-stranded DNA translocates through a protein nanopore in a synthetic membrane.',
    molecularComponents: [
      'ddNTP terminators with distinct fluorophore dyes',
      'Illumina flow cell with surface adapter oligos (P5/P7)',
      'Sequencing library with sample index barcodes',
      'Capillary electrophoresis array or nanopore flow cell',
    ],
    scientificSignificance: 'Underpins the Human Genome Project, personalized cancer oncology (identifying somatic driver mutations), liquid biopsies, and metagenomics.',
    commonTerminology: [
      { term: 'ddNTP', definition: 'Dideoxynucleotide triphosphate; lacks 3\'-OH, halting further phosphodiester chain elongation.' },
      { term: 'Sequencing Depth (Coverage)', definition: 'Average number of unique reads aligned to a specific genomic base (e.g., 30X whole genome, 500X targeted cancer panel).' },
      { term: 'Phred Quality Score (Q score)', definition: 'Logarithmic measure of error probability: Q30 represents 99.9% base call accuracy (1 error in 1,000).' },
    ],
    educationalExamples: 'Performing Sanger sequencing on an edited cancer cell clone to verify homozygous introduction of a premature stop codon.',
    limitationsAndMisconceptions: [
      'Short-read Illumina sequencing (150 bp) struggles with repetitive genomic regions, large structural variations, and pseudogenes; long-read sequencing (PacBio/Nanopore) resolves these structural variants.',
    ],
    relatedTopicIds: ['pcr', 'somatic-mutations', 'cancer-genomics', 'off-target-effects'],
    suggestedAiQuestions: [
      'Why do ddNTPs stop DNA polymerase elongation in Sanger sequencing?',
      'How does the Illumina sequencing-by-synthesis cycle differ from cyclic pyrosequencing?',
    ],
    sources: [
      {
        title: 'DNA sequencing with chain-terminating inhibitors',
        source: 'PNAS',
        year: 1977,
        doi: '10.1073/pnas.74.12.5463',
      },
    ],
  },

  // 17. RNA Interference
  {
    id: 'rna-interference',
    title: 'RNA Interference (RNAi)',
    category: 'Gene Expression',
    difficulty: 'Intermediate',
    shortDefinition: 'Post-transcriptional gene silencing mediated by small double-stranded RNA molecules that trigger mRNA degradation.',
    definition: 'RNA interference (RNAi) is a conserved eukaryotic gene regulation mechanism discovered by Andrew Fire and Craig Mello in 1998. Double-stranded RNA triggers sequence-specific post-transcriptional degradation of homologous target mRNA transcripts or blocks translation.',
    coreMechanism: 'Long dsRNA is processed by the endoribonuclease Dicer into 21–23 bp small interfering RNAs (siRNAs). siRNAs are loaded into the RNA-Induced Silencing Complex (RISC) containing the catalytic endonuclease Argonaute 2 (Ago2). The passenger strand is degraded while the guide strand directs RISC to complementary mRNA. Ago2 cleaves the mRNA backbone, which is rapidly degraded by cellular exonucleases.',
    molecularComponents: [
      'siRNA (synthetic 21-23 nt duplex with 2-nt 3\' overhangs) or shRNA (short hairpin RNA transcribed in nucleus)',
      'Dicer ribonuclease III enzyme',
      'Argonaute 2 (Ago2 endonuclease)',
      'RNA-Induced Silencing Complex (RISC)',
    ],
    scientificSignificance: 'Powerful tool for functional gene knockdown studies and FDA-approved therapeutics (e.g., Patisiran, Givosiran, Inclisiran) targeting liver-synthesized disease proteins.',
    commonTerminology: [
      { term: 'siRNA', definition: 'Small interfering RNA; synthetic double-stranded RNA inducing transient post-transcriptional gene silencing.' },
      { term: 'shRNA', definition: 'Short hairpin RNA; vector-expressed RNA processed by Drosha/Dicer for stable, long-term knockdown.' },
      { term: 'Knockdown vs Knockout', definition: 'RNAi causes partial/transient reduction in mRNA (knockdown), whereas CRISPR introduces permanent genomic DNA disruption (knockout).' },
    ],
    educationalExamples: 'Transfecting EGFR-targeting siRNA into lung carcinoma cells to evaluate cellular dependency on receptor signaling.',
    limitationsAndMisconceptions: [
      'RNAi achieves incomplete gene silencing (typically 70-90% knockdown) rather than complete knockout.',
      'Can cause off-target effects when the seed region of the siRNA cross-reacts with 3\' UTRs of non-target mRNAs similar to microRNAs.',
    ],
    relatedTopicIds: ['gene-expression', 'crispr-cas9', 'oncogenes-tumor-suppressors'],
    suggestedAiQuestions: [
      'How does the biological mechanism of siRNA knockdown differ fundamentally from CRISPR-Cas9 knockout?',
      'Why do siRNAs require 2-nucleotide 3\' dinucleotide overhangs for optimal RISC loading?',
    ],
    sources: [
      {
        title: 'Potent and specific genetic interference by double-stranded RNA in Caenorhabditis elegans',
        source: 'Nature',
        year: 1998,
        doi: '10.1038/35888',
      },
    ],
  },

  // 18. Molecular Cloning
  {
    id: 'molecular-cloning',
    title: 'Molecular Cloning Assembly Strategies',
    category: 'Genetic Engineering',
    difficulty: 'Intermediate',
    shortDefinition: 'Contemporary recombinant DNA assembly technologies: Restriction-Ligation, Golden Gate, and Gibson Assembly.',
    definition: 'Molecular cloning strategies encompass the biochemical methodologies used to assemble single or multiple DNA fragments into circular plasmid vectors with high fidelity and high throughput.',
    coreMechanism: '(1) Restriction-Ligation: Type II restriction enzymes digest vector and insert, followed by T4 ligase sealing; (2) Golden Gate Assembly: Uses Type IIS restriction enzymes (e.g., BsaI, BsmBI) that cut outside their recognition sequence, creating non-palindromic 4-bp overhangs. Digestion and ligation occur simultaneously in one tube without scar sequences; (3) Gibson Assembly: Isothermal single-tube reaction with 3 enzymes: T5 5\'→3\' exonuclease chews back ends to reveal single-strand overlaps, Phusion polymerase fills gaps, and Taq ligase covalently seals nicks.',
    molecularComponents: [
      'Type IIS restriction enzymes (e.g., BsaI, BsmBI, PaqCI)',
      'T5 Exonuclease, Phusion Polymerase, Taq DNA Ligase (Gibson master mix)',
      'Overlapping PCR primers (20-40 bp homology for Gibson)',
      'Recipient destination vectors with matching overhangs',
    ],
    scientificSignificance: 'Golden Gate enables modular assembly of complex CRISPR arrays and transcriptional circuits (MoClo, GoldenBraid). Gibson assembly enables seamless construction of large synthetic chromosomes and multi-gene metabolic pathways.',
    commonTerminology: [
      { term: 'Type IIS Enzyme', definition: 'Endonuclease that cleaves DNA at a defined distance outside its non-palindromic recognition motif.' },
      { term: 'Scarless Assembly', definition: 'Joining of DNA fragments without introducing unwanted restriction site linker sequences.' },
      { term: 'Gibson Isothermal Mix', definition: 'One-pot cocktail of T5 exonuclease, high-fidelity DNA polymerase, and thermostable DNA ligase incubated at 50°C.' },
    ],
    educationalExamples: 'Assembling a 4-part multi-guide CRISPR expression vector in a single 1-hour Golden Gate BsmBI reaction.',
    limitationsAndMisconceptions: [
      'Golden Gate requires domesticating DNA parts (removing internal Type IIS restriction sites via silent mutagenesis).',
    ],
    relatedTopicIds: ['plasmids-vectors', 'recombinant-dna', 'gene-cloning'],
    suggestedAiQuestions: [
      'How do Type IIS restriction enzymes enable directional multi-fragment Golden Gate assembly in a single tube?',
      'Why is the 50°C reaction temperature critical for Gibson Assembly?',
    ],
    sources: [
      {
        title: 'A modular cloning system for standardized assembly of multigene constructs',
        source: 'PLoS ONE',
        year: 2011,
        doi: '10.1371/journal.pone.0016765',
      },
    ],
  },

  // 19. Oncogenes and Tumor Suppressors
  {
    id: 'oncogenes-tumor-suppressors',
    title: 'Oncogenes & Tumor Suppressor Genes',
    category: 'Cancer Research',
    difficulty: 'Beginner',
    shortDefinition: 'The two central classes of cancer genes: mutated growth-accelerators (oncogenes) and inactivated brakes (tumor suppressors).',
    definition: 'In oncology and cancer genetics, malignant transformation arises from accumulated alterations in two principal gene classes: proto-oncogenes, which promote normal cell growth and gain constitutive activation (oncogenes), and tumor suppressor genes (TSGs), which restrain proliferation and maintain genomic integrity but suffer inactivating loss.',
    coreMechanism: 'Proto-Oncogenes to Oncogenes: Dominant alteration where mutation of a single allele suffices. Mechanisms include point mutations (e.g., KRAS G12D locking GTPase in active state), gene amplification (e.g., HER2/ERBB2 copy number gains), and chromosomal translocations creating chimeric oncoproteins (e.g., BCR-ABL1 in CML). Tumor Suppressor Genes: Recessive according to Knudson\'s Two-Hit Hypothesis; both alleles must generally be inactivated. Inactivation occurs via missense mutations/deletions (hit 1) combined with loss of heterozygosity (LOH) or promoter hypermethylation (hit 2). Classic TSGs include TP53, RB1, PTEN, and BRCA1/2.',
    molecularComponents: [
      'Proto-oncogenes: KRAS, MYC, EGFR, BRAF, HER2, PIK3CA',
      'Tumor suppressors: TP53, RB1, PTEN, APC, BRCA1, BRCA2, CDKN2A',
      'GTPases, Receptor Tyrosine Kinases, and DNA repair protein complexes',
    ],
    scientificSignificance: 'Defines modern targeted cancer therapies: small-molecule kinase inhibitors (e.g., Imatinib, Osimertinib, Sotorasib) block activated oncogenic proteins, while synthetic lethality targets tumor suppressor defects (PARP inhibitors for BRCA-mutant tumors).',
    commonTerminology: [
      { term: 'Two-Hit Hypothesis', definition: 'Knudson\'s paradigm stating that both copies of a tumor suppressor gene must be inactivated to initiate tumorigenesis.' },
      { term: 'Driver Mutation', definition: 'A genetic alteration that confers a selective growth advantage to cancer cells, directly promoting malignant transformation.' },
      { term: 'Synthetic Lethality', definition: 'A genetic interaction where deficiency in either of two genes is viable, but simultaneous loss of both causes cell death.' },
    ],
    educationalExamples: 'Targeting BRCA1/2-deficient breast cancer cells with Olaparib (PARP inhibitor), triggering synthetic lethality because HR-deficient cancer cells cannot repair double-strand breaks.',
    limitationsAndMisconceptions: [
      'Misconception: Oncogenes are foreign viral genes. Reality: Proto-oncogenes are essential normal human genes regulating development and cell survival; cancer arises when their regulation is corrupted.',
    ],
    relatedTopicIds: ['apoptosis', 'cancer-biomarkers', 'somatic-mutations', 'cancer-genomics'],
    suggestedAiQuestions: [
      'How does the KRAS G12D point mutation impair GTP hydrolysis?',
      'Why is pharmacological restoration of wild-type p53 function historically difficult compared to kinase inhibition?',
    ],
    sources: [
      {
        title: 'Hallmarks of Cancer: The Next Generation',
        source: 'Cell',
        year: 2011,
        doi: '10.1016/j.cell.2011.02.013',
      },
    ],
  },

  // 20. Apoptosis
  {
    id: 'apoptosis',
    title: 'Apoptosis & Programmed Cell Death',
    category: 'Cancer Research',
    difficulty: 'Intermediate',
    shortDefinition: 'An evolutionarily conserved biochemical pathway of programmed cell death critical for tissue homeostasis and tumor suppression.',
    definition: 'Apoptosis is a genetically programmed, orderly mode of cell death characterized by cell shrinkage, chromatin condensation, nuclear fragmentation, membrane blebbing, and apoptotic body engulfment without eliciting inflammatory immune responses.',
    coreMechanism: 'Two converging execution pathways: (1) Intrinsic (Mitochondrial) Pathway: Triggered by DNA damage or cellular stress. Pro-apoptotic BCL-2 family proteins (BAX, BAK) oligomerize at the outer mitochondrial membrane, inducing MOMP (Mitochondrial Outer Membrane Permeabilization). Cytochrome c is released into the cytosol, binding APAF-1 and dATP to form the apoptosome, which activates initiator Caspase-9. (2) Extrinsic (Death Receptor) Pathway: FasL or TNF-alpha bind cell-surface death receptors (Fas/CD95, TNFR1), assembling DISC (Death-Inducing Signaling Complex) and activating initiator Caspase-8. Both pathways converge on effector Caspases-3 and -7, which cleave key structural and repair proteins (e.g., PARP1, ICAD).',
    molecularComponents: [
      'Pro-apoptotic effectors: BAX, BAK; BH3-only proteins: BIM, PUMA, NOXA, BID',
      'Anti-apoptotic guardians: BCL-2, BCL-XL, MCL-1',
      'Apoptosome complex: Cytochrome c, APAF-1, Procaspase-9',
      'Executioner caspases: Caspase-3, Caspase-7',
    ],
    scientificSignificance: 'Evasion of apoptosis is a fundamental hallmark of cancer. BH3-mimetic drugs (e.g., Venetoclax, an FDA-approved BCL-2 inhibitor) displace pro-apoptotic proteins to trigger apoptosis in leukemia.',
    commonTerminology: [
      { term: 'MOMP', definition: 'Mitochondrial Outer Membrane Permeabilization; the irreversible point-of-no-return in the intrinsic apoptotic cascade.' },
      { term: 'Apoptosome', definition: 'Wheel-shaped heptameric complex of APAF-1, cytochrome c, and caspase-9 that executes caspase cascade activation.' },
      { term: 'BH3-Mimetic', definition: 'Small-molecule targeted therapeutics that mimic BH3-only proteins to antagonize anti-apoptotic BCL-2 family members.' },
    ],
    educationalExamples: 'Treating chronic lymphocytic leukemia (CLL) cells overexpressing BCL-2 with Venetoclax to trigger rapid mitochondrial apoptosis.',
    limitationsAndMisconceptions: [
      'Apoptosis is distinct from necrosis: apoptosis is non-inflammatory and ATP-dependent, whereas necrosis involves plasma membrane rupture and sterile inflammation.',
    ],
    relatedTopicIds: ['oncogenes-tumor-suppressors', 'cancer-biomarkers', 'cancer-genomics'],
    suggestedAiQuestions: [
      'How does the balance between pro-apoptotic (BAX/BAK) and anti-apoptotic (BCL-2/MCL-1) proteins determine cell fate at the mitochondria?',
      'What is the precise role of cleaved PARP1 as an experimental biomarker of apoptosis in Western blots?',
    ],
    sources: [
      {
        title: 'The molecular machinery of regulated cell death',
        source: 'Cell Death & Differentiation',
        year: 2018,
        doi: '10.1038/s41418-017-0012-4',
      },
    ],
  },

  // 21. Cancer Biomarkers
  {
    id: 'cancer-biomarkers',
    title: 'Cancer Biomarkers & Molecular Diagnostics',
    category: 'Cancer Research',
    difficulty: 'Intermediate',
    shortDefinition: 'Biological molecules found in blood, body fluids, or tumor tissue indicating tumor presence, prognosis, or therapeutic sensitivity.',
    definition: 'Cancer biomarkers are quantifiable molecular indicators—including mutated DNA, circulating tumor DNA (ctDNA), RNA expression profiles, cell-surface proteins, or metabolomic products—that differentiate malignant tissue from healthy tissue, predict disease course, or stratify patients for targeted therapy.',
    coreMechanism: 'Classified into three clinical categories: (1) Diagnostic Biomarkers: Detect or confirm malignancy (e.g., PSA for prostate monitoring; fecal occult/DNA for colorectal screening); (2) Prognostic Biomarkers: Forecast overall disease outcome and recurrence risk independent of therapy (e.g., Oncotype DX 21-gene recurrence score in breast cancer); (3) Predictive Biomarkers: Predict likelihood of benefit from a specific targeted therapy (e.g., HER2 amplification predicts Trastuzumab response; EGFR exon 19 deletions predict Osimertinib response; PD-L1 expression predicts Pembrolizumab checkpoint immunotherapy response).',
    molecularComponents: [
      'Circulating tumor DNA (ctDNA) detected via droplet digital PCR (ddPCR) or ultra-deep NGS',
      'Cell-surface receptors: HER2/ERBB2, PD-L1, Trop-2, CD19, CD20',
      'Gene alterations: BRAF V600E, KRAS G12C, ALK rearrangements, MSI-H (Microsatellite Instability-High)',
    ],
    scientificSignificance: 'Drives personalized oncology, liquid biopsies for minimal residual disease (MRD) monitoring, and patient selection in precision clinical trials.',
    commonTerminology: [
      { term: 'Liquid Biopsy', definition: 'Non-invasive analysis of tumor-derived biomarkers (such as ctDNA or circulating tumor cells) from peripheral blood.' },
      { term: 'Predictive vs Prognostic', definition: 'Prognostic biomarkers indicate patient survival outlook regardless of treatment; predictive biomarkers guide choice of specific drugs.' },
      { term: 'ctDNA', definition: 'Circulating tumor DNA released into blood by apoptotic or necrotic cancer cells.' },
    ],
    educationalExamples: 'Evaluating circulating cell-free DNA via droplet digital PCR for KRAS G12D mutations to track therapeutic response in pancreatic adenocarcinoma.',
    limitationsAndMisconceptions: [
      'Elevated protein biomarkers (e.g., PSA, CA-125) can occur in benign inflammatory conditions (e.g., prostatitis, endometriosis); specificity must be interpreted in clinical context.',
    ],
    relatedTopicIds: ['oncogenes-tumor-suppressors', 'somatic-mutations', 'cancer-genomics', 'rt-pcr-qpcr'],
    suggestedAiQuestions: [
      'What is the difference between a prognostic biomarker and a predictive biomarker in clinical oncology?',
      'How does droplet digital PCR (ddPCR) quantify rare ctDNA mutations with variant allele frequencies below 0.1%?',
    ],
    sources: [
      {
        title: 'Biomarkers in oncology: definitions, classification, and applications',
        source: 'Nature Reviews Clinical Oncology',
        year: 2017,
        doi: '10.1038/nrclinonc.2016.142',
      },
    ],
  },

  // 22. Somatic Mutations
  {
    id: 'somatic-mutations',
    title: 'Somatic Mutations & Clonal Evolution',
    category: 'Cancer Research',
    difficulty: 'Advanced',
    shortDefinition: 'Non-inherited genetic alterations acquired in non-germline cells during an organism\'s lifespan driving tumor development.',
    definition: 'Somatic mutations are non-heritable DNA sequence alterations that arise in somatic cells during life due to replication errors, endogenous metabolic stresses, or external carcinogens (UV radiation, tobacco mutagens). Accumulation of driver somatic mutations over decades fuels clonal evolution and malignant neoplasia.',
    coreMechanism: 'Mutational classes include: (1) Single Nucleotide Variants (SNVs), (2) Small Insertions/Deletions (Indels), (3) Copy Number Alterations (CNAs), and (4) Structural Variants (translocations, inversions). Mutations are categorized into: Driver Mutations (which provide selective growth/survival advantages and positive selection) and Passenger Mutations (neutral mutational hitchhikers accumulating during clonal expansions). Mutational Signatures (COSMIC signatures) reflect specific underlying biochemical etiologies (e.g., Signature 7 UV-induced C→T transitions; Signature 4 tobacco-smoke benzo[a]pyrene G→T transversions; Signature 2/13 APOBEC cytidine deaminase activity).',
    molecularComponents: [
      'Driver genes: TP53, KRAS, PIK3CA, ARID1A, VHL',
      'Variant Allele Frequency (VAF, percentage of sequencing reads carrying the variant)',
      'COSMIC Mutational Signature database classifications',
    ],
    scientificSignificance: 'Explains tumor heterogeneity, Darwinian clonal selection under therapeutic pressure, and the molecular basis of drug resistance mechanisms.',
    commonTerminology: [
      { term: 'Variant Allele Frequency (VAF)', definition: 'The fraction of sequencing reads harboring a specific mutation relative to all reads at that locus.' },
      { term: 'Clonal vs Subclonal', definition: 'Clonal mutations are present in all tumor cells (founding events); subclonal mutations exist only in emergent sublineages.' },
      { term: 'Mutational Signature', definition: 'Characteristic pattern of somatic base substitutions reflecting a specific environmental or endogenous mutagenic mechanism.' },
    ],
    educationalExamples: 'Tracking the emergence of the secondary EGFR T790M gatekeeper mutation (responsible for erlotinib resistance) in non-small cell lung cancer biopsies.',
    limitationsAndMisconceptions: [
      'The vast majority (>95%) of somatic mutations in an adult tumor genome are passenger mutations that do not contribute functionally to oncogenesis.',
    ],
    relatedTopicIds: ['oncogenes-tumor-suppressors', 'cancer-genomics', 'dna-sequencing', 'dna-repair'],
    suggestedAiQuestions: [
      'How does the COSMIC database identify distinct mutational signatures from whole-exome sequencing data?',
      'Why does intra-tumor heterogeneity create challenges for single-biopsy molecular profiling?',
    ],
    sources: [
      {
        title: 'Signatures of mutational processes in human cancer',
        source: 'Nature',
        year: 2013,
        doi: '10.1038/nature12477',
      },
    ],
  },

  // 23. Cancer Genomics
  {
    id: 'cancer-genomics',
    title: 'Cancer Genomics & Precision Oncology',
    category: 'Cancer Research',
    difficulty: 'Advanced',
    shortDefinition: 'Large-scale genomic profiling of tumor genomes to understand tumor biology and guide targeted therapeutic selection.',
    definition: 'Cancer genomics applies high-throughput sequencing and bioinformatic technologies to characterize entire tumor genomes, transcriptomes, and epigenomes. Comprehensive consortium projects such as The Cancer Genome Atlas (TCGA) and the International Cancer Genome Consortium (ICGC) have mapped genomic alterations across thousands of human tumors.',
    coreMechanism: 'Tumor samples and matched normal germline DNA are sequenced to filter germline polymorphisms and identify tumor-specific somatic alterations. Key analytical parameters: (1) Tumor Mutational Burden (TMB): Total number of non-synonymous mutations per megabase; high TMB generates neoantigens, predicting immune checkpoint inhibitor efficacy; (2) Microsatellite Instability (MSI): Deficient mismatch repair (dMMR) causes hypermutation in tandem repeat tracts; (3) Actionable Genomic Alterations: Matching driver mutations to FDA-approved targeted inhibitors.',
    molecularComponents: [
      'Whole-Exome Sequencing (WES) and Whole-Genome Sequencing (WGS) workflows',
      'Bioinformatics pipelines: GATK Mutect2, Strelka2, VarScan',
      'The Cancer Genome Atlas (TCGA) multi-omic data commons',
      'Targeted cancer gene panels (e.g., MSK-IMPACT, FoundationOne CDx)',
    ],
    scientificSignificance: 'Shifted oncology from anatomic/histologic classification (e.g., "lung cancer") toward molecularly defined disease taxonomy (e.g., "EGFR-mutant, KRAS G12C, or NTRK-rearranged neoplasm").',
    commonTerminology: [
      { term: 'Tumor Mutational Burden (TMB)', definition: 'Number of somatic non-synonymous mutations per megabase (Mb) of sequenced tumor DNA.' },
      { term: 'Microsatellite Instability (MSI-H)', definition: 'Hypermutable genomic phenotype caused by loss of functional DNA mismatch repair machinery (MLH1, MSH2, MSH6, PMS2).' },
      { term: 'Actionable Mutation', definition: 'A genetic aberration for which an approved targeted medicine or active clinical trial therapy exists.' },
    ],
    educationalExamples: 'Treating a patient with MSI-High colorectal carcinoma with Pembrolizumab (anti-PD-1) based on tumor-agnostic FDA approval.',
    limitationsAndMisconceptions: [
      'Identifying a targetable genomic alteration does not guarantee clinical drug efficacy due to bypass pathway activation, lineage-specific feedback loops, and pharmacokinetic hurdles.',
    ],
    relatedTopicIds: ['oncogenes-tumor-suppressors', 'somatic-mutations', 'cancer-biomarkers', 'dna-sequencing'],
    suggestedAiQuestions: [
      'Why does high Tumor Mutational Burden (TMB-H) correlate with improved response to anti-PD-1 immune checkpoint blockade?',
      'How does The Cancer Genome Atlas (TCGA) integrate genomic, transcriptomic, and methylomic data?',
    ],
    sources: [
      {
        title: 'Comprehensive molecular portraits of human breast tumours',
        source: 'Nature (TCGA Network)',
        year: 2012,
        doi: '10.1038/nature11412',
      },
    ],
  },

  // 24. Biosafety & Ethics in Gene Editing
  {
    id: 'biosafety-ethics',
    title: 'Biosafety & Ethical Governance in Gene Editing',
    category: 'Safety and Ethics',
    difficulty: 'Intermediate',
    shortDefinition: 'International regulatory frameworks, biosafety levels, and ethical principles governing genetic modification.',
    definition: 'Biosafety and bioethical governance in biotechnology encompass the standard operating procedures, containment protocols, institutional review mechanisms, and international consensus guidelines that prevent unintended environmental release, laboratory-acquired exposure, and unethical human reproductive applications of gene editing.',
    coreMechanism: 'Biosafety containment levels (BSL-1 to BSL-4) define physical laboratory requirements, personal protective equipment (PPE), and waste handling protocols (autoclaving, chemical inactivation). Institutional Biosafety Committees (IBC) and Institutional Review Boards (IRB) review experimental gene transfer protocols. Key ethical distinction: Somatic Cell Gene Editing (treats genetic disease in non-reproductive cells of an individual patient; changes are not heritable) versus Germline/Heritable Gene Editing (modifies embryos, sperm, or eggs; edits are passed to future generations, raising profound ethical concerns regarding unintended permanent alterations, eugenics, and equity).',
    molecularComponents: [
      'Biosafety Levels 1 through 4 containment standards (CDC/NIH BMBL 6th Edition)',
      'Institutional Biosafety Committee (IBC) oversight protocols',
      'Autoclave and biocidal chemical inactivation validations (10% bleach, 70% ethanol)',
      'Viral vector packaging replication-incompetence assays (RCL/RCR testing)',
    ],
    scientificSignificance: 'Ensures responsible scientific progress, protects laboratory personnel, prevents accidental release of genetically modified organisms (GMOs), and guards against unverified human reproductive experimentation.',
    commonTerminology: [
      { term: 'Somatic Editing', definition: 'Modification of non-reproductive cells; changes are restricted to the treated patient and not inherited by descendants.' },
      { term: 'Germline Editing', definition: 'Alteration of gametes or early-stage human embryos; changes are inherited by subsequent generations.' },
      { term: 'BSL-2', definition: 'Biosafety Level 2 containment required for moderate-risk biological agents and human cell cultures/viral vectors.' },
    ],
    educationalExamples: 'Requiring BSL-2 practices, biosafety cabinet certification, and replication-competent lentivirus (RCL) screening when working with 2nd-generation lentiviral gene transfer vectors.',
    limitationsAndMisconceptions: [
      'Misconception: BSL-1 labs are suitable for all molecular biology work. Reality: Any work involving human primary cell lines, bloodborne pathogens, or viral vectors (lentivirus, retrovirus) requires certified BSL-2 containment and training.',
    ],
    relatedTopicIds: ['crispr-cas9', 'plasmids-vectors', 'genetic-transformation'],
    suggestedAiQuestions: [
      'What are the key ethical distinctions between somatic cell gene editing and heritable human germline editing?',
      'Why do human cell lines routinely require Biosafety Level 2 (BSL-2) containment?',
    ],
    sources: [
      {
        title: 'Biosafety in Microbiological and Biomedical Laboratories (BMBL)',
        source: 'CDC / NIH',
        year: 2020,
      },
      {
        title: 'Human Genome Editing: Science, Ethics, and Governance',
        source: 'National Academies Press',
        year: 2017,
        doi: '10.17226/24623',
      },
    ],
  },
];
