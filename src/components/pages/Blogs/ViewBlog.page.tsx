import { useEffect, useState } from "react";
import { useBlogPostService, type BlogPostResponse } from "../../../services/useBlogPostService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import BlogPostFormTemplate from "../../templates/Blogs/BlogPostForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewBlogPage = () => {
    const blogPostService = useBlogPostService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [post, setPost] = useState<BlogPostResponse | null>(null);

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
            onSubmit={async () => {}}
            mode={MODE.VIEW}
            post={post}
        />
    );
};

export default ViewBlogPage;
