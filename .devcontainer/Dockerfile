FROM node:lts

ARG USERNAME=scotthal
ARG USER_UID=1100
ARG USER_GID=$USER_UID

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update; \
  apt-get -y install locales less dialog apt-utils man-db bc zsh zip unzip sudo bat vim git lsb-release curl httpie jq; \
  apt-get -y dist-upgrade; \
  echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen; \
  locale-gen; \
  update-locale LANG=en_US.UTF-8; \
  groupadd --gid $USER_GID $USERNAME; \
  useradd -s /bin/zsh --uid $USER_UID --gid $USER_GID -m $USERNAME; \
  echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME; \
  chmod 440 /etc/sudoers.d/$USERNAME; \  apt-get autoremove -y; \
  apt-get clean -y; \
  rm -rf /var/lib/apt/lists/*

ENV DEBIAN_FRONTEND=

USER ${USERNAME}

CMD ["/bin/zsh", "-l"]
