# Google Tag Manager (GTM) 配置指南

## 概述

本项目使用统一的埋点函数 `trackGenerationEvent()` 发送事件到 GTM。所有事件使用统一的事件名 `ai_generate`，通过不同的参数来区分不同的操作。

## 事件结构

当用户点击生成按钮时，会发送以下事件到 `dataLayer`：

```javascript
{
  event: 'ai_generate',
  feature: 'generate',
  page: 'modal' | 'landing',
  position: 'hero',
  tab: 'design' | 'stencil' | 'try-on' | 'cover-up',
  action: 'Generate Design' | 'Create Stencil' | 'Start Projection' | 'Analyze Density'
}
```

## GTM 变量配置步骤

### 1. 创建数据层变量（Data Layer Variables）

在 GTM 中创建以下变量来捕获事件参数：

#### 变量 1: `dlv_feature`
- **变量类型**: 数据层变量 (Data Layer Variable)
- **数据层变量名称**: `feature`
- **数据层版本**: 版本 2
- **变量名称**: `dlv_feature`

#### 变量 2: `dlv_page`
- **变量类型**: 数据层变量 (Data Layer Variable)
- **数据层变量名称**: `page`
- **数据层版本**: 版本 2
- **变量名称**: `dlv_page`

#### 变量 3: `dlv_position`
- **变量类型**: 数据层变量 (Data Layer Variable)
- **数据层变量名称**: `position`
- **数据层版本**: 版本 2
- **变量名称**: `dlv_position`

#### 变量 4: `dlv_tab`
- **变量类型**: 数据层变量 (Data Layer Variable)
- **数据层变量名称**: `tab`
- **数据层版本**: 版本 2
- **变量名称**: `dlv_tab`

#### 变量 5: `dlv_action`
- **变量类型**: 数据层变量 (Data Layer Variable)
- **数据层变量名称**: `action`
- **数据层版本**: 版本 2
- **变量名称**: `dlv_action`

### 2. 创建触发器（Trigger）

#### 触发器: `ai_generate_event`
- **触发器类型**: 自定义事件 (Custom Event)
- **事件名称**: `ai_generate`
- **此触发器触发于**: 所有自定义事件

### 3. 创建标签（Tag）

#### 标签: `GA4 - AI Generate Event`
- **标签类型**: Google Analytics: GA4 事件 (或你使用的分析工具)
- **配置标签**:
  - **事件名称**: `ai_generate`
  - **事件参数**:
    - `feature`: `{{dlv_feature}}`
    - `page`: `{{dlv_page}}`
    - `position`: `{{dlv_position}}`
    - `tab`: `{{dlv_tab}}`
    - `action`: `{{dlv_action}}`
- **触发条件**: `ai_generate_event`

## 详细配置步骤

### 步骤 1: 创建数据层变量

1. 登录 Google Tag Manager
2. 选择你的容器（Container）
3. 点击左侧菜单 **"变量" (Variables)**
4. 点击右上角 **"新建" (New)**
5. 配置每个变量：
   - **变量名称**: 例如 `dlv_feature`
   - **变量类型**: 选择 **"数据层变量" (Data Layer Variable)**
   - **数据层变量名称**: 输入 `feature`（对应代码中发送的参数名）
   - **数据层版本**: 选择 **版本 2**
   - 点击 **"保存" (Save)**

重复以上步骤创建所有 5 个变量。

### 步骤 2: 创建触发器

1. 点击左侧菜单 **"触发器" (Triggers)**
2. 点击右上角 **"新建" (New)**
3. 配置触发器：
   - **触发器名称**: `ai_generate_event`
   - **触发器类型**: 选择 **"自定义事件" (Custom Event)**
   - **事件名称**: 输入 `ai_generate`（必须与代码中的事件名完全一致）
   - **此触发器触发于**: 选择 **"所有自定义事件"**
   - 点击 **"保存" (Save)**

### 步骤 3: 创建标签

1. 点击左侧菜单 **"标签" (Tags)**
2. 点击右上角 **"新建" (New)**
3. 配置标签：
   - **标签名称**: `GA4 - AI Generate Event`
   - **标签类型**: 选择你的分析工具（如 Google Analytics: GA4 事件）
   - **配置标签**:
     - **事件名称**: `ai_generate`
     - **事件参数**: 添加以下参数
       ```
       feature: {{dlv_feature}}
       page: {{dlv_page}}
       position: {{dlv_position}}
       tab: {{dlv_tab}}
       action: {{dlv_action}}
       ```
   - **触发条件**: 选择 `ai_generate_event`
   - 点击 **"保存" (Save)**

### 步骤 4: 发布更改

1. 点击右上角 **"提交" (Submit)**
2. 填写版本名称和说明
3. 点击 **"发布" (Publish)**

## 测试配置

### 使用 GTM 预览模式测试

1. 在 GTM 中点击 **"预览" (Preview)** 按钮
2. 输入你的网站 URL
3. 在网站上点击生成按钮
4. 在 GTM 预览窗口中查看：
   - 触发器是否触发
   - 变量是否正确获取值
   - 标签是否发送

### 使用浏览器控制台测试

在浏览器控制台中运行：

```javascript
// 检查 dataLayer
console.log(window.dataLayer);

// 手动触发事件测试
window.dataLayer.push({
  event: 'ai_generate',
  feature: 'generate',
  page: 'landing',
  position: 'hero',
  tab: 'design',
  action: 'Generate Design'
});
```

## 事件参数说明

| 参数 | 可能的值 | 说明 |
|------|---------|------|
| `feature` | `generate` | 功能标识，固定为 generate |
| `page` | `modal`, `landing` | 页面类型：弹窗或落地页 |
| `position` | `hero` | 按钮位置，固定为 hero |
| `tab` | `design`, `stencil`, `try-on`, `cover-up` | 当前激活的标签页 |
| `action` | `Generate Design`, `Create Stencil`, `Start Projection`, `Analyze Density` | 操作名称 |

## 常见问题

### Q: 变量获取不到值？
A: 确保：
- 数据层变量名称与代码中发送的参数名完全一致（区分大小写）
- 数据层版本设置为版本 2
- 事件已正确发送到 dataLayer

### Q: 触发器不触发？
A: 确保：
- 事件名称与代码中的 `event: 'ai_generate'` 完全一致
- 触发器类型选择为"自定义事件"

### Q: 如何在 Google Analytics 中查看这些事件？
A: 
1. 在 GA4 中，事件会自动显示在"事件"报告中
2. 可以创建自定义报告，按 `tab` 或 `action` 参数进行分组分析
3. 使用探索功能创建更详细的分析报告

## 代码示例

项目中发送事件的代码位置：
- **文件**: `utils/analytics.ts`
- **函数**: `trackGenerationEvent()`
- **调用位置**: `components/Hero.tsx` 中的 `handleGenerateClick()`

## 扩展配置

如果需要添加更多事件追踪，可以：

1. 在 `utils/analytics.ts` 中添加新的追踪函数
2. 在 GTM 中创建对应的变量和触发器
3. 在标签中配置相应的事件参数
