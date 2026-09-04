-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "InviteMode" AS ENUM ('wedding', 'save_the_date');

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('pending', 'yes', 'no', 'maybe');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_rate_limits" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "window_started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_rate_limits_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "template_id" TEXT NOT NULL DEFAULT 'default',
    "partner_one" TEXT NOT NULL,
    "partner_two" TEXT NOT NULL,
    "event_at" TIMESTAMPTZ(6) NOT NULL,
    "venue_name" TEXT NOT NULL,
    "venue_address" TEXT,
    "message" TEXT,
    "accent_color" TEXT NOT NULL DEFAULT '#7a2e3a',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "variant_id" TEXT NOT NULL DEFAULT 'classic',
    "colour_theme_id" TEXT NOT NULL DEFAULT 'ivory',
    "hero_image" TEXT,
    "gallery_images" JSONB,
    "intro_line" TEXT NOT NULL DEFAULT 'Together with their families',
    "ceremony_time" TEXT,
    "reception_time" TEXT,
    "dress_code" TEXT,
    "registry_url" TEXT,
    "accommodation_note" TEXT,
    "rsvp_deadline" TIMESTAMPTZ(6),
    "invite_mode" "InviteMode" NOT NULL DEFAULT 'wedding',
    "schedule_items" JSONB,
    "venue_lat" DOUBLE PRECISION,
    "venue_lng" DOUBLE PRECISION,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" UUID NOT NULL,
    "invite_id" UUID NOT NULL,
    "display_name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_curated" BOOLEAN NOT NULL DEFAULT false,
    "rsvp_status" "RsvpStatus" NOT NULL DEFAULT 'pending',
    "party_size" INTEGER NOT NULL DEFAULT 1,
    "rsvp_note" TEXT,
    "rsvp_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "invites_slug_key" ON "invites"("slug");

-- CreateIndex
CREATE INDEX "invites_user_id_idx" ON "invites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "guests_token_key" ON "guests"("token");

-- CreateIndex
CREATE INDEX "guests_invite_id_idx" ON "guests"("invite_id");

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_invite_id_fkey" FOREIGN KEY ("invite_id") REFERENCES "invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
