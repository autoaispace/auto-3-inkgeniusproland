<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1D-QbZ0NJ23E-bEFR-T_xmoUqCmjZ5CNk

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


- google登录接上，用户数据传入到数据库
- 接入积分系统，给用户中创建积分字段， 然后添加积分要在积分表中有用户的id，名字，变化前的积分，变化后的积分，减少积分，获取该用户的积分，
- 接入支付功能，实现充值添加积分
- 接入产品功能 实现生成，开始生成前先扣除积分运行