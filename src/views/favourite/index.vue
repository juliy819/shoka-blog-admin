<!--
 * @description 收藏夹
 * @author juliy
 * @date 2023/6/24 14:49
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form v-show="showSearch" :inline="true">
      <el-form-item label="标题/描述">
        <el-input v-model="favouriteQuery.keywords" clearable placeholder="请输入关键字" style="width: 200px"
                  @keyup.enter="queryFavourites" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="favouriteQuery.favouriteClassifyName">
          <el-option v-for="(item, index) in favouriteClassifyList" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary" @click="queryFavourites">搜索
        </el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="Plus" plain type="primary" @click="addFavourite">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button :disabled="multiple" icon="Delete" plain type="danger" @click="deleteFavourites(undefined)">
          删除
        </el-button>
      </el-col>
      <!-- 右侧工具栏 -->
      <right-toolbar v-model:show-search="showSearch" @queryTable="getFavouriteList" />
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="favouriteList" @selection-change="changeSelectedId" border>
      <el-table-column align="center" type="selection" />
      <el-table-column align="center" label="描述" width="70" prop="icon">
        <template #default="scope">
          <svg v-if="scope.row.icon.startsWith('svg')" height="45" width="45"
               :viewBox="parseSVG(scope.row.icon, /\/viewBox:(.*?)\//)">
            <path :d="parseSVG(scope.row.icon, /\/d:(.*)/)" :fill="parseSVG(scope.row.icon, /\/fill:(.*?)\//)" />
          </svg>
          <el-image v-else :src="scope.row.icon" style="width: 45px; height: 45px;">
            <template #error>
              <svg-icon icon-class="favourite" size="45px" />
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" width="200" prop="title" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="描述" width="400" prop="description" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="链接" width="300" prop="url" :show-overflow-tooltip="true" />
      <el-table-column align="center" label="排序值" width="80" prop="orderNum" />
      <!-- 操作 -->
      <el-table-column align="center" label="操作" min-width="150">
        <template #default="scope">
          <el-button icon="Edit" link type="primary" @click="updateFavourite(scope.row)">
            修改
          </el-button>
          <el-button icon="Delete" link type="danger" @click="deleteFavourites(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具 -->
    <pagination v-if="count > 0" v-model:limit="favouriteQuery.size" v-model:page="favouriteQuery.current"
                :total="count"
                @pagination="getFavouriteList" />
    <!-- 添加或修改对话框 -->
    <el-dialog v-model="open" :title="title" append-to-body width="500px">
      <el-form ref="favouriteFormRef" :model="favouriteForm" :rules="rules" label-width="100px" @submit.prevent>
        <el-form-item label="网站名称" prop="title">
          <el-input v-model="favouriteForm.title" placeholder="网站的名称" style="width: 250px;"
                    @keyup.enter="submitForm" />
        </el-form-item>
        <el-form-item label="网站描述" prop="description">
          <el-input v-model="favouriteForm.description" placeholder="简单介绍下该网站" style="width: 250px;"
                    @keyup.enter="submitForm" />
        </el-form-item>
        <el-form-item label="网站链接" prop="url">
          <el-input v-model="favouriteForm.url" placeholder="要有http(s)前缀" style="width: 250px;"
                    @keyup.enter="submitForm" />
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-select v-model="favouriteForm.classify" allow-create filterable default-first-option
                     style="width: 250px;">
            <el-option v-for="(item, index) in favouriteClassifyList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="favouriteForm.orderNum" placeholder="升序排列，默认为0" style="width: 250px;"
                    @keyup.enter="submitForm" />
        </el-form-item>
        <el-form-item prop="icon">
          <template #label>
            <span>
              图标
              <el-tooltip class="item" effect="dark" placement="right">
                <el-icon size="15" style="vertical-align: -3px">
                  <question-filled />
                </el-icon>
                <template #content>
                  <p>链接格式：http(s)://......</p>
                  <p>svg格式：svg/viewBox:0 0 0 0/fill:#000000/d:......</p>
                </template>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="favouriteForm.icon" placeholder="链接/svg"
                    style="width: 250px;"
                    @keyup.enter="submitForm" />
        </el-form-item>
        <el-form-item label="图标预览">
          <svg v-if="favouriteForm.icon.startsWith('svg')" height="45" width="45"
               :viewBox="parseSVG(favouriteForm.icon, /\/viewBox:(.*?)\//)">
            <path :d="parseSVG(favouriteForm.icon, /\/d:(.*)/)"
                  :fill="parseSVG(favouriteForm.icon, /\/fill:(.*?)\//)" />
          </svg>
          <el-image v-else :src="favouriteForm.icon" style="width: 45px; height: 45px;">
            <template #error>
              <svg-icon icon-class="favourite" size="45px" />
            </template>
          </el-image>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { favouriteApi } from '@/api/favourite';
import { modal } from '@/utils/modal';
import type { Favourite, FavouriteForm, FavouriteQuery } from '@/api/favourite/types';
import { QuestionFilled } from '@element-plus/icons-vue';

const favouriteFormRef = ref<FormInstance>();
const rules = ref<FormRules>({
  title: [{
    required: true,
    message: '请输入网站名称',
    trigger: 'blur'
  }],
  url: [{
    required: true,
    message: '请输入网站地址',
    trigger: 'blur'
  }]
});
const count = ref(0);
const showSearch = ref(true);
const loading = ref(false);
const title = ref('');
const multiple = ref(true);
const open = ref(false);
const favouriteIdList = ref<number[]>([]);
const favouriteList = ref<Favourite[]>([]);
const favouriteClassifyList = ref<string[]>([]);
const favouriteQuery = ref<FavouriteQuery>({
  current: 1,
  size: 10
});
const favouriteForm = ref<FavouriteForm>({
  id: undefined,
  title: '',
  description: '',
  classify: '',
  icon: '',
  url: '',
  orderNum: 0
});

/**
 * 图标转化
 * @param icon 图标
 * @param regx 正则
 */
const parseSVG = (icon: string, regx: RegExp): string | null => {
  const match = icon.match(regx);
  console.log(match);
  return match ? match[1] : null;
};

/**
 * 添加收藏
 */
const addFavourite = (): void => {
  favouriteFormRef.value?.clearValidate();
  title.value = '添加收藏';
  favouriteForm.value = {
    id: undefined,
    title: '',
    description: '',
    classify: '',
    icon: '',
    url: '',
    orderNum: 0
  };
  open.value = true;
};

/**
 * 修改收藏
 * @param favourite 收藏
 */
const updateFavourite = (favourite: Favourite): void => {
  favouriteFormRef.value?.clearValidate();
  title.value = '修改收藏';
  favouriteForm.value = {
    id: favourite.id,
    title: favourite.title,
    description: favourite.description,
    classify: favourite.classify,
    icon: favourite.icon,
    url: favourite.url,
    orderNum: favourite.orderNum
  };
  open.value = true;
};

/**
 * 提交表单
 */
const submitForm = (): void => {
  favouriteFormRef.value?.validate(valid => {
    if (valid) {
      // 有id表示修改
      if (favouriteForm.value.id !== undefined) {
        favouriteApi.updateFavourite(favouriteForm.value).then(() => {
          modal.notifySuccess('修改成功');
          getFavouriteList();
          open.value = false;
        });
      } else {
        // 无id表示新增
        favouriteApi.addFavourite(favouriteForm.value).then(() => {
          modal.notifySuccess('添加成功');
          getFavouriteList();
          open.value = false;
        });
      }
    }
  });
};

/**
 * 多选处理
 * @param selection 选择项
 */
const changeSelectedId = (selection: Favourite[]): void => {
  favouriteIdList.value = selection.map(item => item.id);
  multiple.value = !selection.length;
};

/**
 * 删除收藏 无id参数代表批量删除
 * @param id 分类id
 */
const deleteFavourites = (id?: number): void => {
  let idList: number[] = [];
  if (id == undefined) {
    idList = favouriteIdList.value;
  } else {
    idList.push(id);
  }
  modal.messageConfirm('确认删除已选中的数据项?').then(() => {
    favouriteApi.deleteFavourites(idList).then(() => {
      modal.notifySuccess('删除成功');
      getFavouriteList();
    });
  }).catch(() => {
  });
};

/**
 * 获取收藏数据
 */
const getFavouriteList = (): void => {
  loading.value = true;
  favouriteApi.getFavouriteList(favouriteQuery.value).then(({ data }) => {
    favouriteList.value = data.data.recordList;
    count.value = data.data.count;
    loading.value = false;
  });

  getFavouriteClassifyList();
};

const getFavouriteClassifyList = (): void => {
  favouriteApi.getFavouriteClassifyList().then(({ data }) => {
    favouriteClassifyList.value = data.data;
  });
  console.log(favouriteClassifyList.value);
};

/**
 * 搜索收藏
 */
const queryFavourites = (): void => {
  favouriteQuery.value.current = 1;
  getFavouriteList();
};

/**
 * 重置搜索
 */
const resetQuery = (): void => {
  favouriteQuery.value.keywords = '';
  favouriteQuery.value.favouriteClassifyName = '';
  favouriteQuery.value.current = 1;
  getFavouriteList();
};

// 初始化时加载数据
onMounted(() => {
  getFavouriteList();
});

</script>

<style scoped lang='scss'>
</style>
