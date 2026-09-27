<p align="center">
  <a href="https://github.com/Gott-mit-Uns/scrutiny">
    <img width="300" alt="Scrutiny 标志" src="webapp/frontend/src/assets/images/logo/scrutiny-logo-dark.png">
  </a>
</p>

# Scrutiny 硬盘健康监控 · 简体中文版本

[![中文镜像构建](https://github.com/Gott-mit-Uns/scrutiny/actions/workflows/zh-cn-image.yaml/badge.svg?branch=agent%2Fzh-cn-v0.9.2)](https://github.com/Gott-mit-Uns/scrutiny/actions/workflows/zh-cn-image.yaml)
[![中文版本](https://img.shields.io/github/v/release/Gott-mit-Uns/scrutiny)](https://github.com/Gott-mit-Uns/scrutiny/releases/latest)
[![许可证](https://img.shields.io/github/license/AnalogJ/scrutiny.svg?style=flat-square)](LICENSE)
[![上游 CI](https://github.com/AnalogJ/scrutiny/actions/workflows/ci.yaml/badge.svg)](https://github.com/AnalogJ/scrutiny/actions/workflows/ci.yaml)
[![上游代码覆盖率](https://codecov.io/gh/AnalogJ/scrutiny/branch/master/graph/badge.svg)](https://codecov.io/gh/AnalogJ/scrutiny)
[![Go API 文档](https://img.shields.io/badge/godoc-reference-blue.svg?style=flat-square)](https://godoc.org/github.com/analogj/scrutiny)

Scrutiny 是一款硬盘健康监控工具，将厂商提供的 S.M.A.R.T. 指标与实际故障率结合，以网页仪表盘展示硬盘状态、温度和历史趋势。

本仓库是 [AnalogJ/scrutiny](https://github.com/AnalogJ/scrutiny) 的简体中文 fork，保留官方后端和采集器，提供中文前端。

> [!NOTE]
> 上游项目仍在持续开发，部分功能尚待完善。监控数据用于辅助判断硬盘状态，不能替代数据备份。

[![Scrutiny 仪表盘](docs/dashboard.png)](https://imgur.com/a/5k8qMzS)

## 本 fork 的版本与分支

| 项目 | 说明 |
| --- | --- |
| 当前中文正式版 | [v0.9.4-zh-cn](https://github.com/Gott-mit-Uns/scrutiny/releases/tag/v0.9.4-zh-cn) |
| 推荐更新标签 | `ghcr.io/gott-mit-uns/scrutiny:latest` |
| 固定版本标签 | `ghcr.io/gott-mit-uns/scrutiny:v0.9.4-zh-cn` |
| 中文镜像架构 | `linux/amd64`、`linux/arm64` |
| 默认分支 `master` | 同步上游源码，并提供本 fork 的中文 README；不包含中文前端改动 |
| 中文分支 `agent/zh-cn-v0.9.2` | 中文前端与镜像构建入口；分支名沿用旧名称，当前镜像为 v0.9.4 |

`latest` 指向本 fork 最近通过构建和发布后检查的中文镜像。它不会自动合并上游代码；维护者合并并发布新版本后，拉取镜像即可更新。需要固定版本或回退时，请使用明确的版本标签。

中文分支已合并上游截至 2026-09-27 的 `master` 更新。本次中文镜像以官方 `v0.9.4-omnibus` 为基础，覆盖中文前端；v0.9.4 发布后的两项后端修复已进入源码，但不包含在这个正式版镜像中。

更多中文镜像构建、翻译原则及回退说明，请参阅[中文分支说明](https://github.com/Gott-mit-Uns/scrutiny/blob/agent/zh-cn-v0.9.2/README.zh-CN.md)。

## 项目介绍

如果服务器连接了多块硬盘，你可能已经接触过 S.M.A.R.T. 和 [`smartd` 守护进程](https://github.com/smartmontools/smartmontools)。[smartd](https://linux.die.net/man/8/smartd) 监控 ATA、IDE 和 SCSI-3 硬盘内置的自监测、分析与报告系统，用于判断硬盘可靠性、预测故障并执行自检。

S.M.A.R.T. 自检可以帮助你在硬盘故障导致永久数据丢失前发现问题，但单独使用 `smartd` 有一些局限：

- S.M.A.R.T. 属性超过一百项，`smartd` 不区分关键故障指标与一般信息指标。
- `smartd` 不记录属性历史，难以判断某项指标是否在持续恶化。
- 厂商设置的阈值可能缺失或过高，只能确认已经发生的故障，难以及时预警。
- `smartd` 主要通过命令行操作，无显示器的服务器更适合使用网页界面。

**Scrutiny 将厂商指标与实际故障率结合，提供硬盘健康仪表盘和监控能力。**

## 主要功能

- 聚焦关键指标的网页仪表盘。
- 与 `smartd` / `smartctl` 工具配合使用。
- 自动发现连接的硬盘。
- 保存 S.M.A.R.T. 指标历史并展示趋势。
- 根据实际故障率提供自定义阈值。
- 跟踪硬盘温度。
- 提供一体化 Docker 镜像，也支持手动安装。
- 通过 Webhook 等渠道发送告警通知。
- 本 fork 提供中文界面、状态标签、日期及运行时长格式。
- 上游计划加入硬盘性能测试与追踪。

## 快速开始

### RAID 与虚拟硬盘

Scrutiny 使用 `smartctl --scan` 发现设备。

- `smartctl` 支持的 RAID 控制器，Scrutiny 原则上也支持；但并非所有控制器都能透传底层 S.M.A.R.T. 数据。
- 某些情况下，扫描无法正确识别设备类型，导致[指标不完整](https://github.com/AnalogJ/scrutiny/issues/45)。可在[采集器配置](example.collector.yaml)中覆盖设备类型。
- 使用 Docker 时，必须通过 `--device` 将 RAID 虚拟磁盘传入容器。设备路径可能位于 `/dev/*` 或 `/dev/bus/*`。
- 不确定设备路径时，先在宿主机运行 `smartctl --scan`，再将列出的设备传入容器。

排障说明见[设备采集器故障排查](docs/TROUBLESHOOTING_DEVICE_COLLECTOR.md)。

### Docker Compose：中文一体化镜像

以下示例适用于两块 SATA 硬盘，请按宿主机实际情况调整设备路径与端口。已有部署只需替换镜像，保留原有配置和数据挂载。

```yaml
services:
  scrutiny:
    image: ghcr.io/gott-mit-uns/scrutiny:latest
    container_name: scrutiny
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - ./config:/opt/scrutiny/config
      - ./influxdb:/opt/scrutiny/influxdb
      - /run/udev:/run/udev:ro
    cap_add:
      - SYS_RAWIO
    devices:
      - /dev/sda:/dev/sda
      - /dev/sdb:/dev/sdb
```

运行：

```bash
docker compose pull
docker compose up -d
```

浏览器访问 `http://宿主机IP:8080`。新版 Docker Compose 无需在文件顶部添加 `version` 字段。

- `/run/udev` 挂载用于读取设备元数据。
- `SYS_RAWIO` 允许 `smartctl` 查询硬盘 S.M.A.R.T. 数据。
- 如果有 **NVMe** 硬盘，还需添加 `SYS_ADMIN` 并映射相应设备，详见上游 [#26](https://github.com/AnalogJ/scrutiny/issues/26#issuecomment-696817130)。
- `devices` 用于让容器访问实际硬盘。
- 中文镜像包含网页服务、API、采集器和 InfluxDB，无需额外启动数据库容器。
- 此示例只开放网页端口；确需从容器外访问 InfluxDB 时，再添加 `8086:8086`。

上游示例见[一体化 Compose 配置](docker/example.omnibus.docker-compose.yml)，其中官方镜像可替换为本 fork 的中文镜像。

### Docker 命令行启动

```bash
docker run -p 8080:8080 --restart unless-stopped \
  -v "$(pwd)/config:/opt/scrutiny/config" \
  -v "$(pwd)/influxdb:/opt/scrutiny/influxdb" \
  -v /run/udev:/run/udev:ro \
  --cap-add SYS_RAWIO \
  --device=/dev/sda \
  --device=/dev/sdb \
  --name scrutiny \
  ghcr.io/gott-mit-uns/scrutiny:latest
```

### 更新与回退

使用 `latest` 时，新中文版本发布后执行：

```bash
docker compose pull
docker compose up -d
```

固定当前版本：

```yaml
image: ghcr.io/gott-mit-uns/scrutiny:v0.9.4-zh-cn
```

回退旧中文版本：

```yaml
image: ghcr.io/gott-mit-uns/scrutiny:v0.9.2-zh-cn
```

修改镜像后重新拉取并创建容器，保留原有配置及数据目录。**不要执行 `docker compose down -v`，以免删除数据卷。** 更新后如仍显示旧界面，请强制刷新浏览器缓存。

### Hub/Spoke 分离部署

上游也支持将采集器、网页服务和数据库分开部署，适合多个服务器集中监控。以下使用的是**官方英文镜像**；本 fork 目前只发布中文一体化镜像。

| 镜像 | 用途 |
| --- | --- |
| `ghcr.io/analogj/scrutiny:latest-collector` | 包含采集器、`smartctl` 和定时调度器，可在每台服务器上运行一个 |
| `ghcr.io/analogj/scrutiny:latest-web` | 提供网页界面和 API，通常只需一个 |
| `influxdb:2.8` | 保存 S.M.A.R.T. 历史数据，通常只需一个 |

安装配置请参阅[Hub/Spoke 安装说明](docs/INSTALL_HUB_SPOKE.md)、[分离部署 Compose 示例](docker/example.hubspoke.docker-compose.yml)及 [InfluxDB 故障排查](docs/TROUBLESHOOTING_INFLUXDB.md)。官方镜像标签见[上游镜像版本列表](https://github.com/AnalogJ/scrutiny/pkgs/container/scrutiny/versions?filters%5Bversion_type%5D=tagged)，也可选择固定版本。

### Podman 无 root 权限部署

使用 Podman Quadlets 部署 Hub 的步骤见[无 root 权限安装说明](docs/INSTALL_ROOTLESS_PODMAN.md)。

### 手动安装

也可不使用 Docker，或让部分组件运行在 Docker 中、其他组件手动安装。步骤见[手动安装说明](docs/INSTALL_MANUAL.md)。需要中文前端时，请从中文分支构建。

## 使用与数据采集

一体化镜像启动后会运行采集器，仪表盘显示检测到的硬盘。默认每天采集一次，也可以手动触发：

```bash
docker exec scrutiny /opt/scrutiny/bin/scrutiny-collector-metrics run
```

分离部署或手动安装时，首次采集前仪表盘可能为空；采集完成后才会显示硬盘列表与 S.M.A.R.T. 状态。

## 配置

默认配置目录为 `/opt/scrutiny/config`，两个配置文件均为可选：

- `scrutiny.yaml`：网页服务与 API 配置，参考 [example.scrutiny.yaml](example.scrutiny.yaml)。
- `collector.yaml`：采集器配置，参考 [example.collector.yaml](example.collector.yaml)。

### 定时采集

调度由外部定时器负责，无法直接在 `collector.yaml` 中设置。官方采集器、一体化镜像及本 fork 的中文一体化镜像支持通过 `COLLECTOR_CRON_SCHEDULE` 修改默认计划（每天午夜，`0 0 * * *`）。例如在 Compose 中设置：

```yaml
environment:
  COLLECTOR_CRON_SCHEDULE: "0 0 * * *"
```

### 告警通知

Scrutiny 支持通过自定义脚本（数据由环境变量提供）、邮件、Webhook、Discord、Gotify、Hangouts、IFTTT、Join、Mattermost、ntfy、Pushbullet、Pushover、Slack、Teams、Telegram 和 Tulip 发送硬盘故障通知。

配置示例见 [example.scrutiny.yaml](example.scrutiny.yaml) 中的 `notify.urls`，更多说明见[通知故障排查](docs/TROUBLESHOOTING_NOTIFICATIONS.md)。

测试通知配置：

```bash
curl -X POST http://localhost:8080/api/health/notify
```

## 调试与日志

### 网页服务与 API

可用环境变量启用调试日志并指定日志文件：

```bash
DEBUG=true
SCRUTINY_LOG_FILE=/tmp/web.log
```

也可在配置文件中设置：

```yaml
log:
  file: '/tmp/web.log'
  level: DEBUG
```

非 Docker 安装可使用命令行参数：

```bash
scrutiny start --debug --log-file /tmp/web.log
```

### 采集器

环境变量：

```bash
DEBUG=true
COLLECTOR_LOG_FILE=/tmp/collector.log
```

非 Docker 安装可使用命令行参数：

```bash
scrutiny-collector-metrics run --debug --log-file /tmp/collector.log
```

## 支持的架构

**本 fork 的中文 Docker 镜像支持 `linux/amd64` 和 `linux/arm64`。** 下表为上游支持情况；macOS 的 Docker 镜像运行于 Linux 虚拟机中，并非原生 macOS 容器。

| 架构 | 上游二进制 | 上游 Docker |
| --- | --- | --- |
| linux-amd64 | ✅ | ✅ |
| linux-arm-5 | ✅ | — |
| linux-arm-6 | ✅ | — |
| linux-arm-7 | ✅ | 仅 web/collector，见 [#236](https://github.com/AnalogJ/scrutiny/issues/236) |
| linux-arm64 | ✅ | ✅ |
| freebsd-amd64 | ✅ | — |
| macos-amd64 | ✅ | ✅（Linux 虚拟机） |
| macos-arm64 | ✅ | ✅（Linux 虚拟机） |
| windows-amd64 | ✅ | 开发中，见 [#15](https://github.com/AnalogJ/scrutiny/issues/15) |
| windows-arm64 | ✅ | — |

## 参与贡献

开发与贡献流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。欢迎提交 Pull Request 改进代码和文档，或通过 Issue 反馈问题。

通用功能与缺陷可向[上游仓库](https://github.com/AnalogJ/scrutiny)反馈；本 fork 的中文翻译与中文镜像问题可在[本仓库](https://github.com/Gott-mit-Uns/scrutiny/issues)反馈。

## 版本管理

上游遵循 [SemVer](https://semver.org/) 语义化版本规范。本 fork 使用 `v0.9.4-zh-cn` 这类标签标识中文版本，正式发布记录见 [Releases](https://github.com/Gott-mit-Uns/scrutiny/releases)。

## 上游作者

- Jason Kulatunga：初始开发，[@AnalogJ](https://github.com/AnalogJ/)。
- Aram Akhavan：维护，[@kaysond](https://github.com/kaysond/)。

## 许可证与素材

- 项目许可证：[MIT](LICENSE)。
- 标志素材：[Glasses by matias porta lezcano](https://thenounproject.com/term/glasses/775232)。

## 支持上游项目

Scrutiny 的开发离不开 [GitHub Sponsors](https://github.com/sponsors/AnalogJ/) 的支持。赞助者从项目发布帖了解 Scrutiny，并选择资助开发者持续维护这款工具。

如果 Scrutiny 对你有帮助，可以考虑[支持上游作者](https://github.com/sponsors/AnalogJ/)。

[![上游项目赞助者](docs/sponsors.png)](https://github.com/sponsors/AnalogJ/)
