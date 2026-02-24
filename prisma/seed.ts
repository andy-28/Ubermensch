import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      {
        Title: "Set up /tasks MVP page",
        Status: "todo",
        Priority: "high",
        IsInbox: true,
      },
      {
        Title: "Review task workflow",
        Status: "inprogress",
        Priority: "normal",
        IsInbox: true,
      },
      {
        Title: "Ship first task feature",
        Status: "done",
        Priority: "normal",
        IsInbox: true,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
