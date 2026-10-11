export interface BiotechTip {
  id: string;
  category: string;
  fact: string;
  referenceTopicId: string;
  sourceNote: string;
}

export const BIOTECH_TIPS: BiotechTip[] = [
  {
    id: 'tip-1',
    category: 'CRISPR Technology',
    fact: 'SpCas9 requires a 5\'-NGG-3\' Protospacer Adjacent Motif (PAM) on the non-target DNA strand and cleaves 3 base pairs upstream of the PAM, predominantly yielding blunt double-strand breaks.',
    referenceTopicId: 'pam-sequence',
    sourceNote: 'Jinek et al., Science 2012',
  },
  {
    id: 'tip-2',
    category: 'Molecular Biology',
    fact: 'High-fidelity DNA polymerases (e.g., Q5, Phusion) have 3\'→5\' exonuclease proofreading activity, reducing misincorporation rates up to 50-fold compared to standard Taq polymerase.',
    referenceTopicId: 'pcr',
    sourceNote: 'New England Biolabs Technical Report',
  },
  {
    id: 'tip-3',
    category: 'Laboratory Calculations',
    fact: 'When preparing molar solutions from dry solid chemicals, always dissolve the reagent in ~80% of your target volume, adjust pH if required, and then bring to final volume in a volumetric flask.',
    referenceTopicId: 'plasmids-vectors',
    sourceNote: 'Cold Spring Harbor Laboratory Protocols',
  },
  {
    id: 'tip-4',
    category: 'Cancer Biology',
    fact: 'Unlike oncogenes which are active in a dominant fashion (one mutated allele suffices), tumor suppressor genes typically follow Knudson’s two-hit hypothesis requiring inactivation of both alleles.',
    referenceTopicId: 'oncogenes-tumor-suppressors',
    sourceNote: 'Knudson, PNAS 1971',
  },
  {
    id: 'tip-5',
    category: 'Gene Editing',
    fact: 'Cytosine Base Editors (CBEs) convert C•G pairs to T•A without creating double-strand DNA breaks by utilizing a cytidine deaminase linked to catalytically impaired Cas9 nickase.',
    referenceTopicId: 'base-editing',
    sourceNote: 'Komor et al., Nature 2016',
  },
  {
    id: 'tip-6',
    category: 'Quantitative PCR',
    fact: 'In real-time qPCR, the cycle threshold (Ct) is inversely related to template abundance: a 1-cycle decrease in Ct corresponds to approximately a 2-fold higher initial nucleic acid copy number.',
    referenceTopicId: 'rt-pcr-qpcr',
    sourceNote: 'Livak & Schmittgen, Methods 2001',
  },
  {
    id: 'tip-7',
    category: 'Genetic Engineering',
    fact: 'Type IIS restriction endonucleases cleave outside their non-palindromic recognition sequences, enabling seamless, scarless Golden Gate multi-fragment assembly in a single tube.',
    referenceTopicId: 'molecular-cloning',
    sourceNote: 'Engler et al., PLoS ONE 2008',
  },
];

export function getTodayTip(): BiotechTip {
  // Rotate tip based on current calendar day
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % BIOTECH_TIPS.length;
  return BIOTECH_TIPS[index];
}
