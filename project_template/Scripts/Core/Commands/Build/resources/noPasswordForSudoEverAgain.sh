if [[ $(sudo grep -L "%sudo ALL=(ALL) NOPASSWD: ALL" /etc/sudoers) ]]; then echo "%sudo ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers; fi;
