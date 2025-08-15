"use client";

import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { API_ROUTE } from "../../../../const/apiRouter";
import { api } from "../../../../library/axios";
import { CreateProjectPayload } from "../../../../api/apiEditproject";
import Image from "next/image";

interface EditViewProps {
  onSearch: () => Promise<void>;
  id: string;
  language?: "vi" | "en";
}

const EditView = ({ onSearch, id, language = "vi" }: EditViewProps) => {
  const [visible, { open, close }] = useDisclosure(false);

  const form = useForm<CreateProjectPayload>({
    initialValues: {
      name: "",
      address: "",
      type: "",
      investor: "",
      image_url: "",
      picture: "",
    },
    validate: {
      name: isNotEmpty("Tên tiếng Việt không được để trống"),
      address: isNotEmpty("Địa chỉ tiếng Việt không được để trống"),
      type: isNotEmpty("Loại tiếng Việt không được để trống"),
      investor: isNotEmpty("Nhà đầu tư tiếng Việt không được để trống"),
      image_url: isNotEmpty("URL hình ảnh không được để trống"),
      picture: isNotEmpty(
        language === "vi" ? "Không được để trống" : "Cannot be empty"
      ),
    },
  });

  const formRef = useRef(form); // Sử dụng useRef để giữ form ổn định

  const handleSubmit = async (values: CreateProjectPayload) => {
    open();
    try {
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
        const url =
          API_ROUTE.EDIT_PROJECTS.replace("{project_id}", id) + `?lang=${language}`;

        const response = await api.get(url);
        const projectData = response.data;

        if (projectData) {
          formRef.current.setValues({ // Sử dụng formRef để cập nhật giá trị
            name: projectData.name || "",
            address: projectData.address || "",
            type: projectData.type || "",
            investor: projectData.investor || "",
            image_url: projectData.image_url || "",
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
  }, [id, language, open, close]); // Không thêm form vào mảng phụ thuộc

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

      <TextInput
        label={language === "vi" ? "Tên " : "Name"}
        placeholder={
          language === "vi" ? "Nhập tên " : "Enter name"
        }
        withAsterisk
        mt="md"
        {...form.getInputProps("name")}
      />
      <TextInput
        label={language === "vi" ? "Địa chỉ " : "Address"}
        placeholder={
          language === "vi" ? "Nhập địa chỉ " : "Enter address"
        }
        withAsterisk
        mt="md"
        {...form.getInputProps("address")}
      />
      <TextInput
        label={language === "vi" ? "Kiểu" : "Type"}
        placeholder={
          language === "vi" ? "Nhập kiểu " : "Enter type"
        }
        withAsterisk
        mt="md"
        {...form.getInputProps("type")}
      />
      <TextInput
        label={language === "vi" ? "Nhà đầu tư " : "Investor"}
        placeholder={
          language === "vi" ? "Nhập nhà đầu tư " : "Enter investor"
        }
        withAsterisk
        mt="md"
        {...form.getInputProps("investor")}
      />
      <TextInput
        label={language === "vi" ? "Hình ảnh" : "Image URL"}
        placeholder={language === "vi" ? "Nhập link ảnh" : "Enter image URL"}
        withAsterisk
        mt="md"
        {...form.getInputProps("image_url")}
      />

      {form.values.image_url && (
        <Image
          src={form.values.image_url}
          alt="Preview"
          width={200} // Thay đổi giá trị này theo kích thước bạn cần
          height={150} // Thay đổi giá trị này theo kích thước bạn cần
          style={{
            marginTop: "10px",
            maxWidth: "200px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      )}
    
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


