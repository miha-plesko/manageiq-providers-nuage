# How to use CFME 5.10.x with Nuage
This document describes steps needed to enable Nuage provider on a fresh
CloudForms appliance. Guide was prepared based on CFME 5.10.0.20 build.

## Enable the Nuage provider
Nuage provider is disabled by default. You can enable it by adding a specific
line at the bottom of the permissions.yml file, which can be done by running
following playbook:

```yaml
- name: Enable Nuage provider on a CFME 5.9.x/5.10.x appliance
  hosts: appliances
  gather_facts: False
  tasks:
    - name: Add Nuage to permissions.yml
      lineinfile:
        path: /var/www/miq/vmdb/config/permissions.yml
        line: "- ems-type:nuage_network"
        state: present
      notify: Reboot Appliance
  handlers:
    - name: Reboot Appliance
      service:
        name: evmserverd
        state: restarted
```

Doing so will allow users to add and use a full-blown Nuage provider.

## Ansible playbook as a callback to Nuage events
CloudForms supports running Ansible playbooks upon arbitrary Nuage event.
There is a [blogpost](https://tech.xlab.si/posts/nuage-ansible-in-automate) available
on this topic accompanied with
[YouTube video](https://www.youtube.com/watch?v=YeXtnjTY67s) where usage is
explained.

In short, you have to enable **Embedded Ansible** server role. Then you can import
arbitrary SCM repository containing your very own Ansible playbooks and run them
anywhere where inline ruby Automate Method could be run as well. Please find official
Embedded Ansible documentation
[here](https://manageiq.gitbook.io/mastering-cloudforms-automation-addendum/embedded_ansible/chapter).

*NOTE: Embedded Ansible server role is redundant which means only one appliance in a
region will have it active at a time.*

Your playbooks can consume CloudForms RESTful API to e.g. obtain current Nuage event
data or Nuage API credentials. There is a role available on Galaxy to assist
you:
[xlab_si.nuage_miq_automate](https://galaxy.ansible.com/xlab_si/nuage_miq_automate). 
Also, please see playbook examples provided in the [example repository][].

*NOTE: Role xlab_si.nuage_miq_automate will fail if you're running appliance with
a self-signed certificate. See 
[this section](https://github.com/xlab-si/nuage-ansible-playbooks#ex03-one-more-for-debugging---with-ssl-cert-validation)
for a workaround to test
playbook anyway (by disabling cert validation).*

Your playbooks can use arbitrary roles but you
have to list them in your SCM repository's `PROJECT_ROOT/roles/requirements.yml`
file. Please see [example repository][] where we list some as well.

If your playbooks require additional **pip packages**, you'll need
to SSH to every appliance that has Embedded Ansible role enabled and install those
in a virtual environment that Embedded is using. This can be achieved by running this
playbook:

```yaml
- name: Install Embedded Ansible pip dependencies
  hosts: appliances
  gather_facts: False
  vars:
    pip_packages:
      - { name: vspk, version: 5.3.2 }
  tasks:
  - name: Install pip packages for Embedded Ansible
    pip:
      name: '{{ item.name }}'
      state: present
      version: '{{ item.version }}'
      virtualenv: /var/lib/awx/venv/ansible
      umask: '0022'
    with_items: '{{ pip_packages }}'
```

*NOTE: It might be appealing to run the "pip install" task from within Embedded 
Ansible playbook itself so that playbook would ensure its own dependencies, but
that fails due to host filesystem being mounted in a read-only manner.* 

[example repository]: https://github.com/xlab-si/nuage-ansible-playbooks

## Links
- https://www.youtube.com/watch?v=YeXtnjTY67s (video)
- https://github.com/xlab-si/nuage-ansible-playbooks (example playbooks)
- https://tech.xlab.si/posts/nuage-ansible-in-automate (blogpost describing role itself)

