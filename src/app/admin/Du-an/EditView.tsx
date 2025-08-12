"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { API_ROUTE } from "../../../../const/apiRouter";
import { api } from "../../../../library/axios";
import { CreateProjectPayload } from "../../../../api/apicreateproject";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
  language?: "vi" | "en";
}

const EditView = ({ onSearch, id, language = "vi" }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateProjectPayload>({
    initialValues: {
      name_vi: "",
      address_vi: "",
      type_vi: "",
      investor_vi: "",
      name_en: "",
      address_en: "",
      type_en: "",
      investor_en: "",
      picture: "",
    },
    validate: {
      name_vi: isNotEmpty("Tên tiếng Việt không được để trống"),
      address_vi: isNotEmpty("Địa chỉ tiếng Việt không được để trống"),
      type_vi: isNotEmpty("Loại tiếng Việt không được để trống"),
      investor_vi: isNotEmpty("Nhà đầu tư tiếng Việt không được để trống"),
      name_en: isNotEmpty("Tên tiếng Anh không được để trống"),
      address_en: isNotEmpty("Địa chỉ tiếng Anh không được để trống"),
      type_en: isNotEmpty("Loại tiếng Anh không được để trống"),
      investor_en: isNotEmpty("Nhà đầu tư tiếng Anh không được để trống"),
      picture: isNotEmpty(
        language === "vi" ? "Không được để trống" : "Cannot be empty"
      ),
    },
  });

  const handleSubmit = async (values: CreateProjectPayload) => {
    open();
    try {
      // Thêm language dưới dạng query param
      const url =
        API_ROUTE.EDIT_PROJECTS.replace("{project_id}", id) + `?lang=${language}`;

      await api.put(url, values);
      await onSearch();
      modals.closeAll();
    } catch (error) {
      console.error("Lỗi khi cập nhật dự án:", error);
      alert(
        language === "vi"
          ? "Đã xảy ra lỗi khi cập nhật dự án."
          : "An error occurred while updating the project."
      );
    } finally {
      close();
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetail = async () => {
      open();
      try {
        // Thêm language dưới dạng query param
        const url =
          API_ROUTE.EDIT_PROJECTS.replace("{project_id}", id) + `?lang=${language}`;

        const response = await api.get(url);
        const projectData = response.data;

        if (projectData) {
          form.setValues({
            name_vi: projectData.name_vi || "",
            address_vi: projectData.address_vi || "",
            type_vi: projectData.type_vi || "",
            investor_vi: projectData.investor_vi || "",
            name_en: projectData.name_en || "",
            address_en: projectData.address_en || "",
            type_en: projectData.type_en || "",
            investor_en: projectData.investor_en || "",
            picture: projectData.picture || "",
          });
        } else {
          alert(
            language === "vi"
              ? "Dự án không được tìm thấy."
              : "Project not found."
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dự án:", error);
        alert(
          language === "vi"
            ? "Không thể tải thông tin dự án."
            : "Unable to load project information."
        );
      } finally {
        close();
      }
    };

    fetchProjectDetail();
  }, [id, language]);

  return (
    <Box
      component="form"
      miw={320}
      mx="auto"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {/* Nếu là tiếng Việt thì hiển thị nhóm input tiếng Việt */}
      {language === "vi" && (
        <SimpleGrid cols={2}>
          <TextInput
            label="Tên dự án"
            placeholder="Nhập tên dự án"
            withAsterisk
            mt="md"
            {...form.getInputProps("name_vi")}
          />
          <TextInput
            label="Địa chỉ"
            placeholder="Nhập Địa chỉ"
            withAsterisk
            mt="md"
            {...form.getInputProps("address_vi")}
          />
          <TextInput
            label="Kiểu"
            placeholder="Nhập kiểu"
            withAsterisk
            mt="md"
            {...form.getInputProps("type_vi")}
          />
          <TextInput
            label="Nhà đầu tư"
            placeholder="Nhập nhà đầu tư"
            withAsterisk
            mt="md"
            {...form.getInputProps("investor_vi")}
          />
        </SimpleGrid>
      )}

      {/* Nếu là tiếng Anh thì hiển thị nhóm input tiếng Anh */}
      {language === "en" && (
        <SimpleGrid cols={2}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            withAsterisk
            mt="md"
            {...form.getInputProps("name_en")}
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            withAsterisk
            mt="md"
            {...form.getInputProps("address_en")}
          />
          <TextInput
            label="Type"
            placeholder="Enter type"
            withAsterisk
            mt="md"
            {...form.getInputProps("type_en")}
          />
          <TextInput
            label="Investor"
            placeholder="Enter investor"
            withAsterisk
            mt="md"
            {...form.getInputProps("investor_en")}
          />
        </SimpleGrid>
      )}

      {/* Trường picture dùng chung cho cả 2 */}
      <TextInput
        label={language === "vi" ? "Tên hình ảnh" : "Picture Name"}
        placeholder={
          language === "vi" ? "Nhập tên hình ảnh" : "Enter picture name"
        }
        withAsterisk
        mt="md"
        {...form.getInputProps("picture")}
      />

      <Group justify="flex-end" mt="lg">
        <Button
          type="submit"
          color="#3598dc"
          loading={visible}
          leftSection={<IconCheck size={18} />}
        >
          {language === "vi" ? "Lưu" : "Save"}
        </Button>
        <Button
          variant="outline"
          color="black"
          type="button"
          loading={visible}
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          {language === "vi" ? "Đóng" : "Close"}
        </Button>
      </Group>
    </Box>
  );
};

export default EditView;



