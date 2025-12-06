-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referral_code" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
