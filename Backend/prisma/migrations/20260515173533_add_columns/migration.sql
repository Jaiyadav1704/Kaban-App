-- CreateTable
CREATE TABLE "columns" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" INTEGER NOT NULL,

    CONSTRAINT "columns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "columns" ADD CONSTRAINT "columns_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
