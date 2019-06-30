// userFormAssigner will ensure:
// - role attribute in form has the already saved role id set to selected
// - check all the modules that have already been assigned
// - set hidden userId attribute in the form
var userFormAssigner = userFormAssigner || (function() {
    let assignedModulesByUser = {};
    let rolesMap = {}

    return {
        setModuleMap: (map) => {
            assignedModulesByUser = map;
        },
		setRolesMap: (map) => {
        	rolesMap = map;
		},
		populateCheckboxes: () => {
        	//TODO: all the checkbox checking shit can go here, for on change + modal on load
		},
        start: () => {
            $(document).ready(() => {
                $('#modal').on('show.bs.modal', function(event) {
                	
                    $('select#role').change(() => {
                        //TODO: review - how do we want precedence to work for modules via role assignment vs. direct module assignment
                        const roleId = $('select#role').val();
						console.log('inside of select role change')
						console.log('curr role', roleId, 'assigned modules', rolesMap[roleId]);
						//TODO: what if role ID is invalid? 
						let roleModules = rolesMap[roleId].modules;
						$(':checkbox').each(function() {
							const moduleId = this.value;
							
							//assigns default role modules to user
							if (roleModules.includes(moduleId)) {
								this.checked = true; 
							} else {
								this.checked = false;
							}
							
							//add additional modules if needed 
							//TODO: can team leaders choose to un-assign modules that were preassigned by role? 
							if (userModules[moduleId]) {
								this.checked = true;
							} else {
								this.checked = false;
							}
						});
					});
                    
                    console.log('hi');
                    const roleId = $(event.relatedTarget).data('role');
                    
                    //selects no role in the dropdown if user doesn't have role yet
                    if (roleId) {
                        $(`select#role option[value=${roleId}]`).prop('selected', true);
                    } else {
                        $('select#role option[value="no-role"]').prop('selected', true);
                    }
                    const userId = $(event.relatedTarget).data('user');
                    
                    const userModules = assignedModulesByUser[userId];
					const roleModules = rolesMap[roleId].modules;

                    // Get all modules and check the ones this user has been assigned
                    $(':checkbox').each(function() {
                        let moduleId = this.value;

						//assigns default role modules to user
						if (roleModules.includes(moduleId)) {
							this.checked = true;
						} else {
							this.checked = false;
						}
                        
						
                        if (userModules[moduleId]) {
                            this.checked = true;
                        } else {
                            this.checked = false;
                        }
                    });

                    // Set a hidden form field with the current user id
                    $(this).find("#userId").val(userId);
                });
            });
        }
    }
})();
