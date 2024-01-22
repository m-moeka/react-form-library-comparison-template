"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  age: z.number().min(10),
});

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <div>
        <input {...register("name")} />
        {errors.name?.message && <p>{errors.name?.message}</p>}
      </div>
      <div>
        <input type="number" {...register("age", { valueAsNumber: true })} />
        {errors.age?.message && <p>{errors.age?.message}</p>}
      </div>
      <TextField {...register("name")} variant="standard" label="Username" />
      <Button variant="outlined">送信</Button>
    </form>
  );
};

export default Page;
