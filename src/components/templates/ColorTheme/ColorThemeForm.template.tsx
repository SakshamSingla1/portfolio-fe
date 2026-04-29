import React, { useEffect } from "react";
import TextField from "../../atoms/TextField/TextField";
import ColorPickerField from "../../atoms/ColorPicker/ColorPicker";
import Button from "../../atoms/Button/Button";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute, capitalizeFirstLetter } from "../../../utils/helper";
import { type ColorTheme } from "../../../services/useColorThemeService";
import { DEFAULT_PALETTE } from "../../../utils/themeConstants";

interface ColorThemeFormProps {
  onSubmit: (values: ColorTheme) => void;
  mode: string;
  colorTheme?: ColorTheme | null;
}

const validationSchema = Yup.object({
  themeName: Yup.string().required("Theme name is required"),
  palette: Yup.object({
    colorGroups: Yup.array()
      .of(
        Yup.object({
          groupName: Yup.string().required("Group name required"),
          colorShades: Yup.array()
            .of(
              Yup.object({
                colorName: Yup.string().required("Color name required"),
                colorCode: Yup.string().required("Color code required"),
              })
            )
            .min(1, "Add at least 1 shade"),
        })
      )
      .min(1, "Add at least 1 group"),
  }),
});

const ColorThemeForm: React.FC<ColorThemeFormProps> = ({
  onSubmit,
  mode,
  colorTheme,
}) => {
  const navigate = useNavigate();

  const formik = useFormik<ColorTheme>({
    initialValues: {
      themeName: "",
      palette: DEFAULT_PALETTE,
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (colorTheme) formik.setValues(colorTheme);
  }, [colorTheme]);

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {capitalizeFirstLetter(mode)} Color Theme
        </h2>
        <p className="text-gray-600">
          Configure the specific color codes for your fixed theme structure
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
            Theme Information
          </h3>
          <TextField
            label="Theme Name"
            placeholder="e.g. Modern Gold, Dark Premium"
            {...formik.getFieldProps("themeName")}
            error={Boolean(
              formik.touched.themeName && formik.errors.themeName
            )}
            helperText={
              formik.touched.themeName ? formik.errors.themeName : ""
            }
            disabled={mode === MODE.VIEW}
            fullWidth
          />
        </div>

        {formik.values.palette.colorGroups.map((group, gIndex) => (
          <div
            key={group.groupName}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
              {capitalizeFirstLetter(group.groupName)} Palette
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.colorShades.map((shade, sIndex) => (
                <div 
                  key={shade.colorName}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {shade.colorName}
                    </p>
                    <ColorPickerField
                      label=""
                      value={shade.colorCode}
                      onChange={(color) =>
                        formik.setFieldValue(
                          `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorCode`,
                          color
                        )
                      }
                      disabled={mode === MODE.VIEW}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between gap-3 pt-4">
          <Button
            variant="tertiaryContained"
            label="Cancel"
            onClick={() =>
              navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME, {}))
            }
          />
          {mode !== MODE.VIEW && (
            <Button
              variant="primaryContained"
              label={mode === MODE.EDIT ? "Update" : "Create"}
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorThemeForm;
