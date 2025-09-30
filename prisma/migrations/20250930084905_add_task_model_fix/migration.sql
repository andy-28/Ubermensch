/*
  Warnings:

  - You are about to drop the `TASK` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TASK";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Task" (
    "ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "Status" TEXT NOT NULL DEFAULT 'todo',
    "IsInbox" BOOLEAN NOT NULL DEFAULT true,
    "Priority" TEXT NOT NULL DEFAULT 'normal',
    "DueDate" DATETIME,
    "WorkDate" DATETIME,
    "Tags" JSONB,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    "CompletedAt" DATETIME,
    "Solution" TEXT,
    "UserID" INTEGER,
    CONSTRAINT "Task_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "USER" ("ID") ON DELETE SET NULL ON UPDATE CASCADE
);
