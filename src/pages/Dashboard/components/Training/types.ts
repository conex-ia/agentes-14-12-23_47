export interface Training {
  uid: string;
  created_at: string;
  tipo: string;
  origem: string;
  resumo: string;
  fase: string;
  base: string;
}

export interface TrainingGridProps {
  trainings: Training[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: Training) => void;
  isDeletingTraining: string | null;
}

export interface ActionButtonProps {
  training: Training;
  onOpenModal: (id: string, phase: string) => void;
  onOpenDeleteModal: (training: Training) => void;
  isDeletingTraining: string | null;
}