var moduleAssigner = moduleAssigner || (function() {
    let assignedModulesByUser = {};

    return {
        setModuleMap: (map) => {
            assignedModulesByUser = map;
        },
        start: () => {
            $(document).ready(() => {
                $('#modal').on('show.bs.modal', function(event) {
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