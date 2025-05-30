import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  TextInput,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
// import { NotificationExtension } from "../../_base/extension/NotificationExtension";
// import { isNullOrUndefined } from "../../_base/extension/StringExtension";
// import Repository from "../../_base/helper/HttpHelper";
// import { ActivatedEdit } from "../../api/ApiUserManagement";
// import { MessageResponse } from "../../model/MessageResponse";
// import { UserManagementInterFace } from "../../model/TblUserManagement";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const EditView = ({ onSearch, id, name }: any) => {
//   const [dataFixedContentType, setDataFixedContentType] = useState<
//     UserManagementInterFace[]
//   >([]);
  const [dataOptionFixedContentType, setDataOptionFixedContentType] = useState<
    any[]
  >([]);

  const entity = {
    dateActive: null,
    fullName: "",
    id: "",
    inActive: false,
    onDelete: false,
    password: "",
    phone: 0,
    role: "",
    roleNumber: null,
    tokenActive: null,
    userName: "",
  };

//   const handleEditUser = async (dataSubmit: UserManagementInterFace) => {
//     const response = await ActivatedEdit(dataSubmit);
//     if (response?.success) {
//       modals.closeAll();
//     }
//     onSearch();
//   };

//   const repository = new Repository(process.env.REACT_APP_Auth_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [iconImage, setIconImage] = useState<string>("");
  const [value, setValue] = useState();
  const [isImageChange, setIsImageChange] = useState<boolean>(false);

//   const form = useForm<UserManagementInterFace>({
//     initialValues: {
//       ...entity,
//     },
//     validate: {
//       userName: isNotEmpty("Tài  khoản chưa nhập"),
//       fullName: isNotEmpty("Tên đăng nhập chưa nhập"),
//       phone: isNotEmpty("Số điện thoại chưa nhập"),
//     },
//   });

//   const handleChangeImage = (file: File | null) => {
//     form.getInputProps("image").onChange(file);
//     setIsImageChange(true);
//   };

//   const callApiGetData = async () => {
//     open();
//     const urlDetail = `/auth/edit?userName=` + name;
//     let callApi = await repository.get<
//       MessageResponse<UserManagementInterFace>
//     >(urlDetail);
//     if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
//       const dataApi = callApi?.data;
//       if (dataApi != null && !isNullOrUndefined(dataApi)) {
//         form.setValues(dataApi);
//       } else {
//         NotificationExtension.Fails("Dữ liệu không tồn tại");
//         modals.closeAll();
//       }
//       close();
//     } else {
//       NotificationExtension.Fails("Dữ liệu không tồn tại");
//       modals.closeAll();
//     }
//   };

//   useEffect(() => {
//     if (name) {
//       callApiGetData();
//     }
//   }, [name]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={300}
        maw={300}
        mx="auto"
        // onSubmit={form.onSubmit((e: UserManagementInterFace) => {
        //   handleEditUser(e);
        // })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <TextInput
          label={"Tài khoản"}
          placeholder={"Nhập tên tài khoản"}
          withAsterisk
          mt="md"
          type="text"
        //   {...form.getInputProps("userName")}
        />
        <TextInput
          label={"Họ và tên"}
          placeholder={"Nhập họ và tên"}
          withAsterisk
          mt="md"
          type="text"
        //   {...form.getInputProps("fullName")}
        />
        <Checkbox
        //   checked={!!form.values.inActive}
          label={"Trạng thái"}
          placeholder={"Hiển thị/Không hiển thị"}
          mt="md"
        //   onChange={(event) =>
        //     form.setFieldValue("inActive", event.currentTarget.checked)
        //   }
        />
        <TextInput
          label={"Số điện thoại"}
          placeholder={"Nhập số điện thoại"}
          withAsterisk
          mt="md"
          type="number"
        //   {...form.getInputProps("phone")}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default EditView;
