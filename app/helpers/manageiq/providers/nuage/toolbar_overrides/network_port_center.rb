module ManageIQ
  module Providers
    module Nuage
      module ToolbarOverrides
        class NetworkPortCenter < ::ApplicationHelper::Toolbar::Override
          button_group(
            'nuage_network_port',
            [
              select(
                :nuage_network_port,
                'fa fa-cog fa-lg',
                t = N_('Edit'),
                t,
                :items => [
                  button(
                    :nuage_assign_security_groups,
                    'pficon pficon-add-circle-o fa-lg',
                    t = N_('Assign Security Groups'),
                    t,
                    :data  => {'function'      => 'sendDataWithRx',
                               'function-data' => {:controller     => 'provider_dialogs',
                                                   :button         => :nuage_assign_security_groups,
                                                   :modal_title    => N_('Assign Security Groups'),
                                                   :component_name => 'AssignNuageSecurityGroupsForm'}.to_json},
                    :klass => ApplicationHelper::Button::ButtonWithoutRbacCheck
                  ),
                ]
              )
            ]
          )
        end
      end
    end
  end
end
