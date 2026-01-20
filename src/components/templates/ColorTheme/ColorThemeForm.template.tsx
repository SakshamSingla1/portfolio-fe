import React, { useEffect } from "react";
import TextField from "../../atoms/TextField/TextField";
import ColorPickerField from "../../atoms/ColorPicker/ColorPicker";
import Button from "../../atoms/Button/Button";

import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { makeRoute, capitalizeFirstLetter } from "../../../utils/helper";
import { type ColorTheme } from "../../../services/useColorThemeService";

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
      palette: {
        colorGroups: [
          {
            groupName: "",
            colorShades: [{ colorName: "", colorCode: "#ffffff" }],
          },
        ],
      },
    },
    validationSchema,
    onSubmit,
  });

  const addGroup = () => {
    formik.setFieldValue("palette.colorGroups", [
      ...formik.values.palette.colorGroups,
      {
        groupName: "",
        colorShades: [{ colorName: "", colorCode: "#ffffff" }],
      },
    ]);
  };

  const removeGroup = (index: number) => {
    formik.setFieldValue(
      "palette.colorGroups",
      formik.values.palette.colorGroups.filter((_, i) => i !== index)
    );
  };

  const addShade = (gIndex: number) => {
    const groups = [...formik.values.palette.colorGroups];
    groups[gIndex].colorShades.push({
      colorName: "",
      colorCode: "#ffffff",
    });
    formik.setFieldValue("palette.colorGroups", groups);
  };

  const removeShade = (gIndex: number, sIndex: number) => {
    const groups = [...formik.values.palette.colorGroups];
    groups[gIndex].colorShades.splice(sIndex, 1);
    formik.setFieldValue("palette.colorGroups", groups);
  };

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
          Define reusable color palettes for consistent UI
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
              Color Groups
            </h3>
            {mode !== MODE.VIEW && (
              <Button
                label="Add Group"
                variant="primaryContained"
                startIcon={<FiPlus />}
                onClick={addGroup}
              />
            )}
          </div>
          <div className="space-y-6">
            {formik.values.palette.colorGroups.map((group, gIndex) => (
              <div
                key={gIndex}
                className="border border-gray-200 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <TextField
                    label="Group Name"
                    value={group.groupName}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `palette.colorGroups.${gIndex}.groupName`,
                        e.target.value
                      )
                    }
                    disabled={mode === MODE.VIEW}
                    fullWidth
                  />
                  {mode !== MODE.VIEW && (
                    <button
                      onClick={() =>
                        removeGroup(gIndex)
                      }
                      className="p-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">
                      Color Shades
                    </h4>
                    {mode !== MODE.VIEW && (
                      <Button
                        label="Add Shade"
                        variant="secondaryContained"
                        startIcon={<FiPlus size={14} />}
                        onClick={() => addShade(gIndex)}
                      />
                    )}
                  </div>
                  {group.colorShades.map((shade, sIndex) => (
                    <div key={sIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <TextField
                        label="Color Name"
                        value={shade.colorName}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorName`,
                            e.target.value
                          )
                        }
                        disabled={mode === MODE.VIEW}
                        fullWidth
                      />
                      <ColorPickerField
                        label="Color Code"
                        value={shade.colorCode}
                        onChange={(color) =>
                          formik.setFieldValue(
                            `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorCode`,
                            color
                          )
                        }
                        showInput
                        disabled={mode === MODE.VIEW}
                      />
                      {mode !== MODE.VIEW && (
                        <div className="flex items-start justify-end">
                          <button
                            onClick={() =>
                              removeShade(gIndex, sIndex)
                            }
                            className="p-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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
