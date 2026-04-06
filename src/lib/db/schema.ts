import {
  pgTable,
  serial,
  varchar,
  text,
  pgEnum,
  date,
  timestamp,
  numeric,
  integer,
  customType,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom type para bytea (almacenamiento de fotos en PostgreSQL)
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return 'bytea';
  },
});

// ─── Enums ────────────────────────────────────────────────────────────────────

export const speciesEnum = pgEnum('species', ['bovine', 'equine']);
export const sexEnum = pgEnum('sex', ['male', 'female']);
export const animalStatusEnum = pgEnum('animal_status', [
  'active',
  'sold',
  'dead',
  'sick',
]);
export const parentRelationEnum = pgEnum('parent_relation', ['father', 'mother']);
export const shiftEnum = pgEnum('shift', ['morning', 'afternoon']);
export const reproductiveEventEnum = pgEnum('reproductive_event', [
  'heat',
  'insemination',
  'mounting',
  'pregnancy_diagnosis',
  'calving',
  'abortion',
]);
export const medicalRecordTypeEnum = pgEnum('medical_record_type', [
  'vaccine',
  'deworming',
  'treatment',
  'illness',
  'checkup',
  'surgery',
  'other',
]);
export const animalEventTypeEnum = pgEnum('animal_event_type', [
  'birth',
  'weighing',
  'vaccination',
  'illness',
  'treatment',
  'production',
  'reproductive_event',
  'sale',
  'death',
  'observation',
]);

// ─── Tabla: owners ────────────────────────────────────────────────────────────

export const owners = pgTable('owners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 200 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Tabla: animals ───────────────────────────────────────────────────────────

export const animals = pgTable('animals', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  species: speciesEnum('species').notNull(),
  breed: varchar('breed', { length: 100 }),
  sex: sexEnum('sex').notNull(),
  birthDate: date('birth_date'),
  status: animalStatusEnum('status').notNull().default('active'),
  marks: text('marks'),
  currentWeight: numeric('current_weight', { precision: 8, scale: 2 }),
  notes: text('notes'),
  ownerId: integer('owner_id'),
  // Padre — referencia interna o texto libre
  fatherAnimalId: integer('father_animal_id'),
  fatherText: varchar('father_text', { length: 200 }),
  // Madre — referencia interna o texto libre
  motherAnimalId: integer('mother_animal_id'),
  motherText: varchar('mother_text', { length: 200 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Tabla: animal_photos ─────────────────────────────────────────────────────

export const animalPhotos = pgTable('animal_photos', {
  id: serial('id').primaryKey(),
  animalId: integer('animal_id').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 50 }).notNull(),
  fileSize: integer('file_size').notNull(),
  photoData: bytea('photo_data').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// ─── Tabla: animal_parent_history ─────────────────────────────────────────────

export const animalParentHistory = pgTable('animal_parent_history', {
  id: serial('id').primaryKey(),
  animalId: integer('animal_id').notNull(),
  relationType: parentRelationEnum('relation_type').notNull(),
  previousAnimalId: integer('previous_animal_id'),
  previousText: varchar('previous_text', { length: 200 }),
  newAnimalId: integer('new_animal_id'),
  newText: varchar('new_text', { length: 200 }),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
  changedBy: varchar('changed_by', { length: 100 }).default('system'),
  notes: text('notes'),
});

// ─── Tabla: medical_records ───────────────────────────────────────────────────

export const medicalRecords = pgTable('medical_records', {
  id: serial('id').primaryKey(),
  animalId: integer('animal_id').notNull(),
  recordType: medicalRecordTypeEnum('record_type').notNull(),
  date: date('date').notNull(),
  medication: varchar('medication', { length: 200 }),
  dose: varchar('dose', { length: 100 }),
  veterinarian: varchar('veterinarian', { length: 200 }),
  nextCheckDate: date('next_check_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Tabla: milk_production ───────────────────────────────────────────────────

export const milkProduction = pgTable('milk_production', {
  id: serial('id').primaryKey(),
  animalId: integer('animal_id').notNull(),
  date: date('date').notNull(),
  shift: shiftEnum('shift'),
  liters: numeric('liters', { precision: 6, scale: 2 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Tabla: reproductive_records ──────────────────────────────────────────────

export const reproductiveRecords = pgTable('reproductive_records', {
  id: serial('id').primaryKey(),
  animalId: integer('animal_id').notNull(),
  eventType: reproductiveEventEnum('event_type').notNull(),
  date: date('date').notNull(),
  bullCode: varchar('bull_code', { length: 100 }),
  calvingAnimalId: integer('calving_animal_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Tabla: animal_events ─────────────────────────────────────────────────────

export const animalEvents = pgTable('animal_events', {
  id: serial('id').primaryKey(),
  animalId: integer('animal_id').notNull(),
  eventType: animalEventTypeEnum('event_type').notNull(),
  eventDate: date('event_date').notNull(),
  title: varchar('title', { length: 200 }),
  description: text('description'),
  metadata: text('metadata'), // JSON string para datos extra sin tipar
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const ownersRelations = relations(owners, ({ many }) => ({
  animals: many(animals),
}));

export const animalsRelations = relations(animals, ({ one, many }) => ({
  owner: one(owners, {
    fields: [animals.ownerId],
    references: [owners.id],
  }),
  photos: many(animalPhotos),
  parentHistory: many(animalParentHistory),
  medicalRecords: many(medicalRecords),
  milkProduction: many(milkProduction),
  reproductiveRecords: many(reproductiveRecords),
  events: many(animalEvents),
}));

export const animalPhotosRelations = relations(animalPhotos, ({ one }) => ({
  animal: one(animals, {
    fields: [animalPhotos.animalId],
    references: [animals.id],
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  animal: one(animals, {
    fields: [medicalRecords.animalId],
    references: [animals.id],
  }),
}));

export const milkProductionRelations = relations(milkProduction, ({ one }) => ({
  animal: one(animals, {
    fields: [milkProduction.animalId],
    references: [animals.id],
  }),
}));

export const reproductiveRecordsRelations = relations(reproductiveRecords, ({ one }) => ({
  animal: one(animals, {
    fields: [reproductiveRecords.animalId],
    references: [animals.id],
  }),
}));

export const animalEventsRelations = relations(animalEvents, ({ one }) => ({
  animal: one(animals, {
    fields: [animalEvents.animalId],
    references: [animals.id],
  }),
}));

// ─── Types inferidos ──────────────────────────────────────────────────────────

export type Owner = typeof owners.$inferSelect;
export type NewOwner = typeof owners.$inferInsert;
export type Animal = typeof animals.$inferSelect;
export type NewAnimal = typeof animals.$inferInsert;
export type AnimalPhoto = typeof animalPhotos.$inferSelect;
export type NewAnimalPhoto = typeof animalPhotos.$inferInsert;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type NewMedicalRecord = typeof medicalRecords.$inferInsert;
export type MilkProduction = typeof milkProduction.$inferSelect;
export type NewMilkProduction = typeof milkProduction.$inferInsert;
export type ReproductiveRecord = typeof reproductiveRecords.$inferSelect;
export type NewReproductiveRecord = typeof reproductiveRecords.$inferInsert;
export type AnimalEvent = typeof animalEvents.$inferSelect;
export type NewAnimalEvent = typeof animalEvents.$inferInsert;
export type AnimalParentHistory = typeof animalParentHistory.$inferSelect;
