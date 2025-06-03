// 'use client';

// import React, { ReactNode, useRef } from "react";
// import {
//   EuiButton,
//   EuiFieldSearch,
//   EuiFlexGroup,
//   EuiFlexItem,
//   EuiFormRow,
// } from "@elastic/eui";
// import { Menu, Tooltip } from "@mantine/core";
// import { IconChevronDown } from "@tabler/icons-react";

// type AppSearchProps = {
//   onChangeText: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   loading: boolean;
//   onChange?: (selectedItems: any) => void;
//   onSearch: () => void;
//   elementSearch?: ReactNode[];
// };

// const AppSearch = ({
//   onChangeText,
//   loading,
//   onSearch,
//   elementSearch,
// }: AppSearchProps) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTimeout(() => {
//       onChangeText(e);
//     }, 400);
//   };

//   return (
//     <EuiFlexGroup>
//       <EuiFormRow style={{ maxWidth: "100%" }} label="Tìm kiếm :">
//         <EuiFlexGroup alignItems="flexEnd">
//           <EuiFlexItem grow>
//             <EuiFieldSearch
//               placeholder="Tìm kiếm..."
//               fullWidth
//               aria-label="An example of search with fullWidth"
//               onChange={handleChangeText}
//               onKeyDown={(e) => {
//                 if (e.code === "Enter") {
//                   onSearch();
//                 }
//               }}
//               disabled={loading}
//               inputRef={(node: any) => {
//                 // 👉 Truy cập input DOM thật trong EuiFieldSearch
//                 const inputEl = node?.querySelector?.("input");
//                 if (inputEl) {
//                   inputRef.current = inputEl;
//                 }
//               }}
//             />
//           </EuiFlexItem>

//           {elementSearch && (
//             <EuiFlexItem grow={false}>
//               <Menu
//                 trigger="hover"
//                 closeOnClickOutside={false}
//                 shadow="md"
//                 width={500}
//                 openDelay={100}
//                 closeDelay={300}
//               >
//                 <Menu.Target>
//                   <Tooltip label="Hiển thị tùy chọn tìm kiếm">
//                     <div
//                       style={{
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                     >
//                       <IconChevronDown
//                         className="Menu_IconChevronDown_Search"
//                         width={35}
//                         size={20}
//                       />
//                     </div>
//                   </Tooltip>
//                 </Menu.Target>
//                 <Menu.Dropdown>
//                   <Menu.Label>Tùy chọn tìm kiếm</Menu.Label>
//                   {elementSearch.map((item, index) => (
//                     <div key={index}>{item}</div>
//                   ))}
//                 </Menu.Dropdown>
//               </Menu>
//             </EuiFlexItem>
//           )}

//           <EuiFlexItem grow={false}>
//             <EuiButton
//               isLoading={loading}
//               iconType="lensApp"
//               isDisabled={loading}
//               onClick={onSearch}
//             >
//               Tìm kiếm
//             </EuiButton>
//           </EuiFlexItem>
//         </EuiFlexGroup>
//       </EuiFormRow>
//     </EuiFlexGroup>
//   );
// };

// export default AppSearch;
'use client';

import React from "react";
import {
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
} from "@elastic/eui";
import { Menu, Tooltip } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

const AppSearch = () => {
  return (
    <EuiFlexGroup>
      <EuiFormRow style={{ maxWidth: "100%", height: "60px" }} >
        <EuiFlexGroup alignItems="flexEnd">
          <EuiFlexItem grow>
            <EuiFieldSearch
              placeholder="Tìm kiếm..."
              aria-label="An example of search with fullWidth"
            
            
            />
          </EuiFlexItem>

          {/* <EuiFlexItem grow={false}>
            <Menu
              trigger="hover"
              closeOnClickOutside={false}
              shadow="md"
              width={500}
              openDelay={100}
              closeDelay={300}
            >
             
              <Menu.Dropdown>
                <Menu.Label>Tùy chọn tìm kiếm</Menu.Label>
              </Menu.Dropdown>
            </Menu>
          </EuiFlexItem */}

          <EuiFlexItem grow={false}>
      <EuiButton
  iconType="lensApp"
  style={{
    border: "none",
    boxShadow: "none",
    backgroundColor: "rgb(64, 108, 136)", // hoặc bất kỳ màu nào bạn muốn
    color: "#fff", // nếu cần thay màu chữ cho phù hợp
  }}
>
  Tìm kiếm
</EuiButton>

          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    </EuiFlexGroup>
  );
};

export default AppSearch;
