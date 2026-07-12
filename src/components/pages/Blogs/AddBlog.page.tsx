import { useBlogPostService, type BlogPostRequest } from "../../../services/useBlogPostService";
import { useFileService } from "../../../services/useFileService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import BlogPostFormTemplate from "../../templates/Blogs/BlogPostForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddBlogPage = () => {
    const blogPostService = useBlogPostService();
    const fileService = useFileService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async (values: BlogPostRequest, coverFile: File | null) => {
        try {
            const response = await blogPostService.create(values);
            if (response?.status === HTTP_STATUS.OK || response?.status === HTTP_STATUS.CREATED) {
                const post = response.data?.data;
                if (coverFile && post?.id) {
                    await fileService.upload(coverFile, post.id, "BLOG_POST", { isPrimary: true });
                }
                showSnackbar("success", response.data?.message || "Blog post created");
                navigate(ADMIN_ROUTES.BLOGS);
            } else {
                showSnackbar("error", response?.data?.message || "Failed to create blog post");
            }
        } catch (error) {
            showSnackbar("error", String(error));
        }
    };

    return (
        <BlogPostFormTemplate
            onSubmit={handleSubmit}
            mode={MODE.ADD}
        />
    );
};

export default AddBlogPage;
