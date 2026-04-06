// Mapeo de valores de enum (inglés) a etiquetas de UI (español)

export const speciesLabel: Record<string, string> = {
  bovine: 'Bovino',
  equine: 'Equino',
};

export const sexLabel: Record<string, string> = {
  male: 'Macho',
  female: 'Hembra',
};

export const statusLabel: Record<string, string> = {
  active: 'Activo',
  sold: 'Vendido',
  dead: 'Muerto',
  sick: 'Enfermo',
};

export const shiftLabel: Record<string, string> = {
  morning: 'Mañana',
  afternoon: 'Tarde',
};

export const reproductiveEventLabel: Record<string, string> = {
  heat: 'Celo',
  insemination: 'Inseminación',
  mounting: 'Monta',
  pregnancy_diagnosis: 'Diagnóstico de preñez',
  calving: 'Parto',
  abortion: 'Aborto',
};

export const medicalRecordTypeLabel: Record<string, string> = {
  vaccine: 'Vacuna',
  deworming: 'Desparasitación',
  treatment: 'Tratamiento',
  illness: 'Enfermedad',
  checkup: 'Revisión',
  surgery: 'Cirugía',
  other: 'Otro',
};

export const animalEventTypeLabel: Record<string, string> = {
  birth: 'Nacimiento',
  weighing: 'Pesaje',
  vaccination: 'Vacunación',
  illness: 'Enfermedad',
  treatment: 'Tratamiento',
  production: 'Producción',
  reproductive_event: 'Evento reproductivo',
  sale: 'Venta',
  death: 'Muerte',
  observation: 'Observación',
};

export const statusBadgeClass: Record<string, string> = {
  active: 'badge-success',
  sick: 'badge-warning',
  sold: 'badge-info',
  dead: 'badge-error',
};

export const speciesIcon: Record<string, string> = {
  bovine: '🐄',
  equine: '🐎',
};
