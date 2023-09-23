import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

import { connection } from "../../db";
import { TSearchEngine } from "../../types/common";

const db = connection();

const schema = yup.object().shape({
  identifier: yup.string().required(),
  name: yup.string().required(),
});

function get() {
  return db("engine").select(["identifier", "name"]);
}

function handleError(error: any, response: NextApiResponse) {
  if (error instanceof yup.ValidationError) {
    return response.status(400).send({ error: error.errors });
  }

  response.status(500).send({ error: error.code ?? error });
}

function insert(engine: TSearchEngine) {
  return db("engine").insert(engine).returning(["identifier", "name"]);
}

function remove(identifier: string) {
  return db("engine").delete().where({ identifier });
}

function update(identifier: string, data: Partial<TSearchEngine>) {
  return db("engine")
    .update(data)
    .where({ identifier })
    .returning(["identifier", "name"]);
}

function validateEngine(body: unknown) {
  schema.validateSync(body, {
    abortEarly: false,
  });
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const { method } = request;
  let { body } = request;

  if (body.length) {
    const parsed = JSON.parse(body);
    const deepTrim = (obj: unknown) => {
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
        validateEngine(body);
        const result = await insert(body);

        response.status(200).send(result);
      } catch (error) {
        handleError(error, response);
      }
      break;
    }

    case "PUT": {
      try {
        validateEngine(body.data);
        const result = await update(body.identifier, body.data);

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
