# Scrutiny 简体中文版本

本分支基于官方 Scrutiny `v0.9.2`，仅修改前端展示文字和时间格式。硬盘采集、API、SMART 状态枚举及 InfluxDB 数据结构保持官方实现不变。

## 构建镜像

在仓库根目录运行：

```bash
docker build -f Dockerfile.zh-CN -t scrutiny-zh:v0.9.2 .
```

`Dockerfile.zh-CN` 会编译本仓库中的中文前端，并将它覆盖到官方 `ghcr.io/analogj/scrutiny:v0.9.2-omnibus` 镜像的 `/opt/scrutiny/web` 目录。

## Docker Compose

GitHub Actions 构建完成后，可以直接使用：

```yaml
image: ghcr.io/gott-mit-uns/scrutiny:v0.9.2-zh-cn
```

也可以使用前面构建的本地镜像：

```yaml
image: scrutiny-zh:v0.9.2
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
image: ghcr.io/analogj/scrutiny:v0.9.2-omnibus
```

重新创建容器即可。只要原来的配置和 InfluxDB 持久化目录仍然挂载，历史记录不会因为切换前端镜像而丢失。

## 翻译原则

- 仅翻译用户能看到的界面文字。
- 不翻译 API 地址、JSON 字段、设备协议和后端状态枚举。
- SMART、UUID、WWN、SCT 等缩写保留，避免影响故障排查。
- 原始 SMART 属性名称及厂商元数据保留英文，以便与 `smartctl` 输出和厂商资料对应。
