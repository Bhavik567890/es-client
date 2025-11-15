import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks";
import type { RootState } from "../store";
import { createPost, fetchPost, updatePost } from "../features/posts/postslice";
import { postFormSchema, type PostFormType } from "../validation/postschema";
import toast from "react-hot-toast";

import '../../src/styles/form.scss'
import type { ApiResponse, Post } from "../features/posts/type";
const AddEditPost: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const existing = useSelector((s: RootState) =>
    s.posts.items.find((p) => p._id === id)
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors,isSubmitting },
  } = useForm<PostFormType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      author: "",
      body: "",
    },
  });

  useEffect(() => {
    if (id) dispatch(fetchPost(id));
  }, [id]);

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        author: existing.author,
        body: existing.body,
      });
    }
  }, [existing]);

const onSubmit = async (data: PostFormType) => {
  try {
    const res = id
      ? await dispatch(updatePost({ id, data })).unwrap()
      : await dispatch(createPost(data)).unwrap();

    toast.success(res.message);
    navigate("/");
  } catch (err) {
    toast.error(String(err));
  }
};


  return (
    <div className="page add-edit">
      <h2>{id ? "Edit Post" : "Add Post"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Title
          <input {...register("title")} />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </label>

        <label>
          Author
          <input {...register("author")} />
          {errors.author && <p className="error">{errors.author.message}</p>}
        </label>

        <label>
          Body
          <textarea {...register("body")} />
          {errors.body && <p className="error">{errors.body.message}</p>}
        </label>

      <button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Saving..." : id ? "Update" : "Create"}
</button>

      </form>
    </div>
  );
};

export default AddEditPost;
