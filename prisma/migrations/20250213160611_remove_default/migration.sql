-- AlterTable
ALTER TABLE "activity_log" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "activity_log_id_seq";

-- AlterTable
ALTER TABLE "item_log" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "item_log_id_seq";

-- AlterTable
ALTER TABLE "rewarded_roles" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "rewarded_roles_id_seq";

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "roles_id_seq";

-- AlterTable
ALTER TABLE "user_roles" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "user_roles_id_seq";
