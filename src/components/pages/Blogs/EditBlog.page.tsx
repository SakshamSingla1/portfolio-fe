import { useEffect, useState } from "react";
import { useBlogPostService, type BlogPostRequest, type BlogPostResponse } from "../../../services/useBlogPostService";
import { useFileService } from "../../../services/useFileService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import BlogPostFormTemplate from "../../templates/Blogs/BlogPostForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditBlogPage = () => {
    const blogPostService = useBlogPostService();
    const fileService = useFileService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [post, setPost] = useState<BlogPostResponse | null>(null);


    const handleSubmit = async (values: BlogPostRequest, coverFile: File | null) => {
        if (!id) return;
        try {
            const response = await blogPostService.update(Number(id), values);
            if (response?.status === HTTP_STATUS.OK) {
                const updated = response.data?.data;
                if (coverFile && updated?.id) {
                    await fileService.upload(coverFile, updated.id, "BLOG_POST", { isPrimary: true });
                }
                showSnackbar("success", response.data?.message || "Blog post updated");
                navigate(ADMIN_ROUTES.BLOGS);
            } else {
                showSnackbar("error", response?.data?.message || "Failed to update blog post");
            }
        } catch (error) {
            showSnackbar("error", String(error));
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            const response = await blogPostService.remove(Number(id));
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar("success", response.data?.message || "Blog post deleted");
                navigate(ADMIN_ROUTES.BLOGS);
            } else {
                showSnackbar("error", response?.data?.message || "Failed to delete blog post");
            }
        } catch (error) {
            showSnackbar("error", String(error));
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            try {
                const response = await blogPostService.getById(Number(id));
                if (response?.status === HTTP_STATUS.OK && response.data) {
                    setPost(response.data.data);
                }
            } catch (error) {
                showSnackbar("error", String(error));
            }
        };
        fetchPost();
    }, [id, blogPostService, showSnackbar]);

    return (
        <BlogPostFormTemplate
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            mode={MODE.EDIT}
            post={post}
        />
    );
};

export default EditBlogPage;
