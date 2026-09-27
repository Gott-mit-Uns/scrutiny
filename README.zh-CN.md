# Scrutiny 简体中文版本

本分支已合并官方 `master` 截至 2026-09-27 的更新，保留原有简体中文界面和时间格式。中文镜像使用最新正式版 `v0.9.4` 的官方后端、采集器及 InfluxDB，仅覆盖中文前端；`v0.9.4` 发布后的后端提交已同步到源码，但不包含在这个基于正式版的镜像中。

分支名 `agent/zh-cn-v0.9.2` 为兼容原有构建入口继续保留，当前镜像版本为 `v0.9.4-zh-cn`。旧的 `v0.9.2-zh-cn` 镜像标签保持不变，可用于回退。

本次更新保留全部原有汉化内容，并纳入上游的详情表格排序修复、隐藏空主机标题和依赖更新。镜像保留前端目录的访问权限，并显式显示中文镜像版本号。

## 构建镜像

在仓库根目录运行：

```bash
docker build -f Dockerfile.zh-CN -t scrutiny-zh:v0.9.4 .
```

`Dockerfile.zh-CN` 会编译本仓库中的中文前端，并将它覆盖到官方 `ghcr.io/analogj/scrutiny:v0.9.4-omnibus` 镜像的 `/opt/scrutiny/web` 目录。

## Docker Compose

GitHub Actions 构建完成后，可以直接使用：

```yaml
image: ghcr.io/gott-mit-uns/scrutiny:v0.9.4-zh-cn
```

如需跟随最近通过构建验证的中文版本，可使用：

```yaml
image: ghcr.io/gott-mit-uns/scrutiny:latest
```

`latest` 始终指向本 fork 的中文镜像，只有版本镜像完成构建和中文首页、目录权限检查后才更新。它不会自动同步上游代码；维护者合并并发布新版本后，执行 `docker compose pull` 和 `docker compose up -d` 即可更新。需要固定版本或回退时使用明确的版本标签。

也可以使用前面构建的本地镜像：

```yaml
image: scrutiny-zh:v0.9.4
```

其他端口、设备权限和持久化目录保持不变，然后重新创建容器：

```bash
docker compose down
docker compose up -d
```

不要使用 `docker compose down -v`，以免删除数据卷。更新后建议在浏览器中使用 `Ctrl+F5` 强制刷新缓存。

## 回退官方版本

将 Compose 中的镜像恢复为：

```yaml
image: ghcr.io/analogj/scrutiny:v0.9.4-omnibus
```

重新创建容器即可。只要原来的配置和 InfluxDB 持久化目录仍然挂载，历史记录不会因为切换前端镜像而丢失。

## 翻译原则

- 仅翻译用户能看到的界面文字。
- 不翻译 API 地址、JSON 字段、设备协议和后端状态枚举。
- SMART、UUID、WWN、SCT 等缩写保留，避免影响故障排查。
- 原始 SMART 属性名称及厂商元数据保留英文，以便与 `smartctl` 输出和厂商资料对应。
