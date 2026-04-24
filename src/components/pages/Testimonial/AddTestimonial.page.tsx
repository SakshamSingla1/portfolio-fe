import { useTestimonialService, type TestimonialRequest } from "../../../services/useTestimonialService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import TestimonialFormTemplate from "../../templates/Testimonial/TestimonialForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const AddTestimonialPage = () => {
    const testimonialService = useTestimonialService();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const onClose = () => navigate(ADMIN_ROUTES.TESTIMONIALS);

    const handleSubmit = async (values: TestimonialRequest) => {
        try {
            const response = await testimonialService.create({
                ...values,
            });
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                onClose();
                navigate(ADMIN_ROUTES.TESTIMONIALS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    return (
        <div>
            <TestimonialFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.ADD}
            />
        </div>
    )
}
export default AddTestimonialPage;
