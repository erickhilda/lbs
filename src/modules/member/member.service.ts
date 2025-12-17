import { Effect } from "effect";
import { db } from "../../database/db";
import { Member } from "./member.model";
import type { ErrorMessage } from "../../types";

export class MemberService {
  addMember(name: string): Effect.Effect<Member, ErrorMessage> {
    return Effect.try({
      try: () => {
        const stmt = db.prepare("INSERT INTO members (name) VALUES (?)");
        const result = stmt.run(name);

        const memberId = Number(result.lastInsertRowid);
        return new Member({
          id: memberId,
          name,
          borrowedBooks: [],
        });
      },
      catch: (error) => ({
        type: "DatabaseError" as const,
        message: `Failed to add member: ${error}`,
      }),
    });
  }

  getMember(memberId: number): Effect.Effect<Member, ErrorMessage> {
    return Effect.try({
      try: () => {
        const stmt = db.prepare("SELECT * FROM members WHERE id = ?");
        const row = stmt.get(memberId) as any;

        if (!row) {
          return Effect.fail({
            type: "MemberNotFound" as const,
            memberId,
          });
        }

        const borrowedStmt = db.prepare(
          "SELECT book_id FROM borrow_records WHERE member_id = ? AND return_date IS NULL",
        );
        const borrowedRows = borrowedStmt.all(memberId) as any[];
        const borrowedBooks = borrowedRows.map((r) => r.book_id);

        return Effect.succeed(
          new Member({
            id: row.id,
            name: row.name,
            borrowedBooks,
          }),
        );
      },
      catch: (error) => {
        if (Effect.isEffect(error)) {
          return error;
        }
        return Effect.fail({
          type: "DatabaseError" as const,
          message: `Failed to get member: ${error}`,
        });
      },
    }).pipe(Effect.flatten);
  }
}

export const memberService = new MemberService();
