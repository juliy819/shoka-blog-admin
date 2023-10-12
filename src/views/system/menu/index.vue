<!--
 * @description 菜单管理页面
 * @author juliy
 * @date 2023/10/10 10:04
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="menuQuery" v-show="showSearch" :inline="true">
      <el-form-item label="菜单名称">
        <el-input @keyup.enter="queryMenus" v-model="menuQuery.keywords" clearable placeholder="请输入菜单名称"
                  style="width: 200px" />
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-select v-model="menuQuery.isDisable" placeholder="是/否" clearable style="width: 200px">
          <el-option v-for="item in isDisable" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="queryMenus">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="addMenu(undefined)">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="sort" @click="toggleExpandAll">
          {{ isExpandAll ? '折叠' : '展开' }}
        </el-button>
      </el-col>
      <right-toolbar v-model:show-search="showSearch" @queryTable="getMenuList" />
    </el-row>
    <el-table :data="menuList" v-if="refreshTable" v-loading="loading" row-key="id"
              :default-expand-all="isExpandAll" highlight-current-row>
      <!-- 菜单名称 -->
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="200" />
      <!-- 图标 -->
      <el-table-column prop="icon" label="图标" align="center" width="90">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <!-- 排序 -->
      <el-table-column prop="orderNum" label="排序" align="center" width="60" />
      <!-- 类型 -->
      <el-table-column prop="menuType" label="类型" align="center" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.menuType === 'M'" type="warning">目录</el-tag>
          <el-tag v-if="scope.row.menuType === 'C'" type="success">菜单</el-tag>
          <el-tag v-if="scope.row.menuType === 'B'" type="danger">按钮</el-tag>
        </template>
      </el-table-column>
      <!-- 是否禁用 -->
      <el-table-column prop="isDisable" label="是否禁用" align="center" width="80">
        <template #default="scope">
          <el-tag v-if="scope.row.isDisable === 0">否</el-tag>
          <el-tag v-if="scope.row.isDisable === 1" type="info">是</el-tag>
        </template>
      </el-table-column>
      <!-- 是否隐藏 -->
      <el-table-column prop="isHidden" label="是否隐藏" align="center" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.isHidden === 0">否</el-tag>
          <el-tag v-if="scope.row.isHidden === 1" type="info">是</el-tag>
        </template>
      </el-table-column>
      <!-- 组件路径 -->
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
      <!-- 权限标识 -->
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
      <!-- 创建时间 -->
      <el-table-column label="创建时间" align="center" prop="createTime" width="120">
        <template #default="scope">
          <span>{{ formatDate(scope['row']['createTime']) }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="210">
        <template #default="scope">
          <el-button v-if="scope.row.menuType === 'M' || scope.row.menuType === 'C'" type="success" link icon="Plus"
                     @click="addMenu(scope.row)">新增
          </el-button>
          <el-button type="primary" link icon="Edit" @click="editMenu(scope.row)">编辑</el-button>
          <el-button type="danger" link icon="Delete" @click="deleteMenu(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增/编辑菜单 -->
    <el-dialog class="menu-dialog" :title="title" v-model="addOrUpdate" @close="closeDialog" append-to-body>
      <el-form ref="menuFormRef" :model="menuForm" :rules="rules" label-width="100">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select v-model="menuForm.parentId" :data="menuTree" value-key="id"
                              placeholder="选择上级菜单" filterable check-strictly accordion />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="B">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="menuForm.menuType !== 'B'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover popper-class="menu-icon-popover" placement="bottom-start" trigger="click">
                <template #reference>
                  <el-button plain round>
                    <template #icon>
                      <svg-icon v-if="menuForm.icon" :icon-class="menuForm.icon" />
                      <el-icon v-else>
                        <search />
                      </el-icon>
                    </template>
                    {{ menuForm.icon ? `${menuForm.icon} / 更换图标` : '选择图标' }}
                  </el-button>
                </template>
                <icon-select @selected="(iconName) => menuForm.icon = iconName" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="menuForm.menuType != 'B'">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip
                      content="访问的路由地址，如：user; 内链/外链则填写URL，带http/https前缀，如https://cn.bing.com"
                      placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="menuForm.path" placeholder="请输入路由地址或URL" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="menuForm.menuType === 'C'">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip content="访问的组件路径，如：/article/category，默认在views目录下" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="menuForm.menuType !== 'M'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="控制器中定义的权限字符，如：system:user:list" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  权限字符
                </span>
              </template>
              <el-input v-model="menuForm.perms" placeholder="请输入权限标识" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24">
            <el-form-item prop="orderNum">
              <template #label>
                <span>
                  <el-tooltip content="菜单的显示顺序，数字小的排在前面" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  排列顺序
                </span>
              </template>
              <el-input-number v-model="menuForm.orderNum" :min="1" :max="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="menuForm.menuType != 'B'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="外链：点击后会跳转至新标签页" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否外链
                </span>
              </template>
              <el-radio-group v-model="menuForm.isFrame">
                <el-radio v-for="dict in isFrame" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="menuForm.menuType != 'B'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否隐藏
                </span>
              </template>
              <el-radio-group v-model="menuForm.isHidden">
                <el-radio v-for="dict in isHidden" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" v-if="menuForm.menuType != 'B'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <el-icon><question-filled /></el-icon>
                  </el-tooltip>
                  是否禁用
                </span>
              </template>
              <el-radio-group v-model="menuForm.isDisable">
                <el-radio v-for="dict in isDisable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { Menu, MenuForm, MenuQuery, MenuTree } from '@/api/menu/types';
import { menuApi } from '@/api/menu';
import { formatDate } from '@/utils/date';
import type { FormInstance, FormRules } from 'element-plus';
import { modal } from '@/utils/modal';
import { QuestionFilled, Search as search } from '@element-plus/icons-vue';

const menuFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '顺序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
});

const showSearch = ref(true);
const loading = ref(false);
const title = ref('');
const addOrUpdate = ref(false);
const menuQuery = ref<MenuQuery>({} as MenuQuery);
const refreshTable = ref(true);
const isExpandAll = ref(false);
const menuForm = ref<MenuForm>({} as MenuForm);
const menuTree = ref<MenuTree[]>([]);
const menuList = ref<Menu[]>([]);

const isDisable = [{ value: 0, label: '否' }, { value: 1, label: '是' }];
const isHidden = [{ value: 0, label: '否' }, { value: 1, label: '是' }];
const isFrame = [{ value: 1, label: '否' }, { value: 0, label: '是' }];
/**
 * 切换菜单展开/折叠
 */
const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
};

/**
 * 添加菜单
 * @param menu 菜单信息
 */
const addMenu = async (menu?: Menu) => {
  resetForm();
  title.value = '添加菜单';
  await getMenuOptionTree();
  if (menu !== undefined && menu.id) {
    menuForm.value.parentId = menu.id;
  } else {
    menuForm.value.parentId = 0;
  }
  addOrUpdate.value = true;
};

/**
 * 编辑菜单
 * @param menu 菜单信息
 */
const editMenu = async (menu: Menu) => {
  title.value = '编辑菜单';
  await getMenuOptionTree();
  menuForm.value = menu;
  addOrUpdate.value = true;
};

/**
 * 删除菜单
 * @param menuId 菜单id
 */
const deleteMenu = (menuId: number) => {
  modal.messageConfirm('是否删除该菜单？').then(() => {
    menuApi.deleteMenu(menuId).then(() => {
      modal.notifySuccess('删除成功');
      getMenuList();
    });
  }).catch(() => {});
};

/**
 * 重置表单数据
 */
const resetForm = () => {
  menuFormRef.value?.clearValidate();
  menuForm.value = {
    id: undefined,
    parentId: 0,
    menuName: '',
    menuType: 'C',
    path: undefined,
    icon: undefined,
    component: undefined,
    orderNum: 0,
    isFrame: 1,
    isHidden: 0,
    isDisable: 0,
    perms: undefined
  };
};

/**
 * 关闭对话框
 */
const closeDialog = () => {
  addOrUpdate.value = false;
  resetForm();
};

/**
 * 提交表单
 */
const submitForm = () => {
  console.log(menuForm.value);
  menuFormRef.value?.validate(async valid => {
    if (valid) {
      if (menuForm.value.id) {
        await menuApi.updateMenu(menuForm.value).then(() => {
          modal.notifySuccess('修改成功');
          closeDialog();
          getMenuList();
        });
      } else {
        await menuApi.addMenu(menuForm.value).then(() => {
          modal.notifySuccess('添加成功');
          closeDialog();
          getMenuList();
        });
      }
    }
  });
};

/**
 * 获取菜单树
 */
const getMenuOptionTree = async () => {
  await menuApi.getMenuOptionTree().then(({ data }) => {
    const tempMenuTree: MenuTree[] = [];
    const menuTreeItem: MenuTree = { id: 0, label: '顶级菜单', children: data.data };
    tempMenuTree.push(menuTreeItem);
    menuTree.value = tempMenuTree;
  }).catch(() => {});
};

/**
 * 获取菜单数据
 */
const getMenuList = () => {
  loading.value = true;
  menuApi.getMenuList(menuQuery.value).then(({ data }) => {
    menuList.value = data.data;
    loading.value = false;
  }).catch(() => {});
};

/**
 * 查询菜单数据
 */
const queryMenus = () => {
  getMenuList();
};

onMounted(() => {
  getMenuList();
});


</script>

<style scoped lang='scss'>

</style>

<style lang='scss'>
.menu-icon-popover {
  width: 480px !important;
}

.menu-dialog {
  width: 680px;
}

@media screen and (max-width: 767px) {
  .menu-icon-popover {
    width: 260px !important;
  }

  .menu-dialog {
    width: 400px;
  }
}
</style>
