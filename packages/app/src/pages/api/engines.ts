import { connection } from "@giggle/db";
import { DBTEngine } from "@giggle/types";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const db = connection();

const parser: z.ZodType<DBTEngine> = z.lazy(() =>
  z.object({
    api_type: z.union([z.literal("DEFAULT"), z.literal("SITE_RESTRICTED")]),
    identifier: z.string(),
    name: z.string(),
  }),
);

const returning = ["api_type", "identifier", "name"];

function get() {
  return db("engine").select(returning);
}

function handleError(error: any, response: NextApiResponse) {
  if (error instanceof z.ZodError) {
    const {
      errors: [firstError],
    } = error;
    const message = `${firstError.message}: ${firstError.code}`;

    return response.status(400).send({ error: message });
  }

  response.status(500).send({ error: error.code ?? error });
}

function insert(engine: DBTEngine) {
  return db("engine").insert(engine).returning(returning);
}

async function remove(identifier: string) {
  await db("engine").delete().where({ identifier });

  return { identifier };
}

function update(identifier: string, data: Partial<DBTEngine>) {
  return db("engine").update(data).where({ identifier }).returning(returning);
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

  switch (method) {
    case "DELETE": {
      try {
        const result = await remove(body.identifier);
        response.status(200).send(result);
      } catch (error) {
        handleError(error, response);
      }
      break;
    }

    case "GET": {
      try {
        const result = await get();
        response.status(200).send(result);
      } catch (error) {
        handleError(error, response);
      }
      break;
    }

    case "POST": {
      try {
        const data = validateEngine(body);
        const result = await insert(data);

        response.status(200).send(result);
      } catch (error) {
        handleError(error, response);
      }
      break;
    }

    case "PUT": {
      try {
        const data = validateEngine(body.data);
        const result = await update(body.identifier, data);

        response.status(200).send(result);
      } catch (error) {
        handleError(error, response);
      }
      break;
    }

    default:
      response.status(405).end();
  }
}
