### 使用方法

初次执行

```bash
yarn
```

以后每次运行

```bash
# node >= 16
yarn start

# node < 16
yarn start:safe
```

### 添加 ./release/*.json

JSON 格式

```json
{
    "build": "编译命令（选填，默认为 npm run build）",
    "dist": "编译后的文件位置（选填，默认为 dist）",
    "from": "项目目录",
    "to": "移动目录",
    "git": "git 目录（选填，不填写则不会提交 git）",
    "push": "推送命令（选填，不填写则不会提交 git）"
}
```

演示

```json
{
    "build": "npm run build",
    "dist": "dist",
    "from": "/Users/chenhui/myCode/ZJproject/smart_zx_html_dd/html/smart_zx_html",
    "to": "/Users/chenhui/myCode/ZJproject/common_prod_zx/zx_app_dd_h5/plenary_meeting",
    "git": "/Users/chenhui/myCode/ZJproject/common_prod_zx",
    "push": "git push origin release"
}
```