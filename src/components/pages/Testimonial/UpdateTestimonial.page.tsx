import { useEffect, useState } from "react";
import { useTestimonialService, type Testimonial, type TestimonialRequest } from "../../../services/useTestimonialService";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import TestimonialFormTemplate from "../../templates/Testimonial/TestimonialForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const EditTestimonialPage = () => {
    const testimonialService = useTestimonialService();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

    const handleSubmit = async (values: TestimonialRequest) => {
        try {
            if (!id) return;
            const response = await testimonialService.update(String(id), values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', `${response?.data?.message}`);
                navigate(ADMIN_ROUTES.TESTIMONIALS);
            } else {
                showSnackbar('error', `${response?.data?.message}`);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    }

    const getTestimonial = async (id: string | null) => {
        try {
            const response = await testimonialService.getById(id);
            if (response?.status === HTTP_STATUS.OK && response.data) {
                setTestimonial(response.data.data);
            }
        } catch (error) {
            showSnackbar('error', `${error}`);
        }
    };

    useEffect(() => {
        if (id) {
            getTestimonial(String(id));
        }
    }, [id]);

    return (
        <div>
            <TestimonialFormTemplate
                onSubmit={handleSubmit}
                mode={MODE.EDIT}
                testimonial={testimonial}
            />
        </div>
    );
};

export default EditTestimonialPage;