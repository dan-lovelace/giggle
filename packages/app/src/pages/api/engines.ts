import { connection } from "@giggle/db";
import { DBTEngine } from "@giggle/types";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const db = connection();

const parser: z.ZodType<DBTEngine> = z.lazy(() =>
  z.object({
    api_type: z.union([z.literal("DEFAULT"), z.literal("SITE_RESTRICTED")]),
    identifier: z.string().min(1),
    name: z.string().min(1),
  }),
);

const returning = ["api_type", "identifier", "name"];

function get(): Promise<Array<DBTEngine>> {
  return db("engine").select(returning);
}

async function insert(engine: DBTEngine): Promise<DBTEngine> {
  const result = await db("engine").insert(engine).returning(returning);

  return result[0];
}

async function remove(identifier: string) {
  await db("engine").delete().where({ identifier });

  return { identifier };
}

async function update(
  identifier: string,
  data: DBTEngine,
): Promise<{ identifier: string; data: DBTEngine }> {
  const result = await db("engine")
    .update(data)
    .where({ identifier })
    .returning(returning);

  return {
    identifier,
    data: result[0],
  };
}

function validateEngine(body: unknown) {
  return parser.parse(body);
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method } = request;
  let { body } = request;

  if (body.length) {
    const parsed = JSON.parse(body);
    const deepTrim = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].trim();
        } else {
          deepTrim(obj[key]);
        }
      });

      return obj;
    };

    body = deepTrim(parsed);
  }

  try {
    switch (method) {
      case "DELETE": {
        const result = await remove(body.identifier);

        response.status(200).send(result);
        break;
      }

      case "GET": {
        const result = await get();

        response.status(200).send(result);
        break;
      }

      case "POST": {
        const data = validateEngine(body);
        const result = await insert(data);

        response.status(200).send(result);
        break;
      }

      case "PUT": {
        const data = validateEngine(body.data);
        const result = await update(body.identifier, data);

        response.status(200).send(result);
        break;
      }

      default:
        response.status(405).end();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const {
        errors: [firstError],
      } = error;
      const message = `${firstError.message}: ${firstError.code}`;

      return response.status(400).send({ error: message });
    }

    response.status(500).send({ error: error.code ?? error.message ?? error });
  }
}
