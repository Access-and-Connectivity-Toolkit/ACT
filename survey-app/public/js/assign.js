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
        start: () => {
            $(document).ready(() => {
                // Hide error message from previous error (if any)
                $('#modal').on('hide.bs.modal', function(event){ 
                    $('#modal-error').addClass('hidden');
                });

                $('#edit-user').on('show.bs.modal', function(event) {
                    const currUser = $(event.relatedTarget).data('user');
                    
                    $(this).find('input[name="first"]').val(currUser.name.first);
                    $(this).find('input[name="last"]').val(currUser.name.last);
                    $(this).find('input[name="email"]').val(currUser.email);
                    $(this).find('input[name="affiliation"]').val(currUser.affiliation);
        
                    // Set a hidden form field with the current user id
                    $(this).find("#editUserId").val(currUser._id);
                });

                $('#modal').on('show.bs.modal', function(event) {
                	// Select appropriate modules based on chosen role
                    $('select#role').change(() => {
                        const roleId = $('select#role').val();

                        if (roleId === 'no-role') return;
                        if (roleId === undefined || rolesMap[roleId] === undefined) {
                            $('#modal-error').removeClass('hidden');
                            return;
                        }
                        
						let roleModules = rolesMap[roleId].modules;
						$(':checkbox').each(function() {
							const moduleId = this.value;
							
							//assigns default role modules to user
							if (roleModules.includes(moduleId)) {
								this.checked = true; 
							} else {
								this.checked = false;
							}
						});
					});
                    
                    const roleId = $(event.relatedTarget).data('role');
                    
                    //selects no role in the dropdown if user doesn't have role yet
                    if (roleId) {
                        $(`select#role option[value=${roleId}]`).prop('selected', true);
                    } else {
                        $('select#role option[value="no-role"]').prop('selected', true);
                    }
                    const userId = $(event.relatedTarget).data('user');
                    
                    const userModules = assignedModulesByUser[userId];

                    // Get all modules and check the ones this user has been assigned
                    $(':checkbox').each(function() {
                        let moduleId = this.value;
						
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
