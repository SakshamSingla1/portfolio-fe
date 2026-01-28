import { useEffect, useState } from "react";
import { useTestimonialService, type Testimonial } from "../../../services/useTestimonialService";
import { MODE } from "../../../utils/constant";
import { useParams } from "react-router-dom";
import TestimonialFormTemplate from "../../templates/Testimonial/TestimonialForm.template";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { HTTP_STATUS } from "../../../utils/types";

const ViewTestimonialPage = () => {
    const testimonialService = useTestimonialService();
    const { id } = useParams();
    const { showSnackbar } = useSnackbar();
    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);

    const getTestimonial = async (id: string | null) => {
        try {
            const response = await testimonialService.getById(String(id));
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
                onSubmit={() => { }}
                mode={MODE.VIEW}
                testimonial={testimonial}
            />
        </div>
    );
};

export default ViewTestimonialPage;