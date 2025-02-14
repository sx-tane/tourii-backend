-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_id" DROP DEFAULT;
DROP SEQUENCE "users_user_id_seq";
