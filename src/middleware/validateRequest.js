import { ZodError } from "zod";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = req[source];

      const parsed = schema.parse(data);

      if (source === "query" || source === "params") {
        const target = req[source];

        Object.keys(target).forEach((key) => {
          delete target[key];
        });

        Object.assign(target, parsed);
      } else {
        req[source] = parsed;
      }

      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));

        return res.status(400).json({
          message: "Validation error",
          errors,
        });
      }

      return next(err);
    }
  };
};
