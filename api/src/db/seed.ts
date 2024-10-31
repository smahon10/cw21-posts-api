import { connection, db } from "./index";
import { comments, posts } from "./schema";

async function seed() {
  console.log("Seeding database");

  console.log("Cleaning existing data...");
  await db.delete(comments);
  await db.delete(posts);

  console.log("Resetting sequence...");
  await db.run(`DELETE FROM sqlite_sequence where name = 'comments'`);
  await db.run(`DELETE FROM sqlite_sequence where name = 'posts'`);

  console.log("Inserting sample data...");

  for (let i = 1; i <= 5; i++) {
    const post = await db
      .insert(posts)
      .values({
        content: `Post ${i}`,
        date: new Date(),
      })
      .returning()
      .get();

    for (let j = 1; j <= 3; j++) {
      await db
        .insert(comments)
        .values({
          content: `Comment ${j} on Post ${i}`,
          date: new Date(),
          postId: post.id
        })
        .returning();
    }
  }


}

seed()
  .then(() => console.log("Seeding complete"))
  .catch((err) => console.error("Seeding failed", err))
  .finally(() => connection.close());
