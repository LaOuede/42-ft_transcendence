#------------------------------------------------------------------------------#
#                          BANNER & COLOR SETTINGS                             #
#------------------------------------------------------------------------------#

#Banner
define BANNER
                   
$W   _____                                      _                     
$W  |_   _|                                    | |                    
$W    | |_ __ __ _ _ __  ___  ___ ___ _ __   __| | ___ _ __   ___ ___ 
$W    | | '__/ _` | '_ \/ __|/ __/ _ \ '_ \ / _` |/ _ \ '_ \ / __/ _ \ 
$W    | | | | (_| | | | \__ \ (_|  __/ | | | (_| |  __/ | | | (_|  __/ 
$W    \_/_|  \__,_|_| |_|___/\___\___|_| |_|\__,_|\___|_| |_|\___\___| 

$W             Welcome to ft_transcendence - A journey to the stars!
endef
export BANNER

# Colors settings
Y = $(shell tput -Txterm setaf 3)
C = $(shell tput -Txterm setaf 6)
W = $(shell tput -Txterm setaf 7)

#------------------------------------------------------------------------------#
#                                  RULES                                       #
#------------------------------------------------------------------------------#

all: up
	@echo $Y"$$BANNER"$W
	@echo "         $W...made by $Cacouture$W, $Cemlamoth$W, $Cfbouchar$W, $Cgle-roux$W" and $Ckmehour$Z
	@echo "             $W...evaluated by $Y$(USER)\n\n$W"

help:
	@echo "Usage: make [target]"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Start the containers
up:
	docker compose up -d
	@echo "--> If you want to populate the database type 'make pop' 🌱."

down:
	docker compose down

reup: down up

# Check the status of the containers
status:
	@docker compose ps

# ---------------------------------------------------------------------------- #
# Open a bash shell in the container
shell-%:
	@docker compose exec $* sh

# ---------------------------------------------------------------------------- #
django:
	@docker compose exec django python manage.py $*

# ----------------------------------------------------------------------------
# Shows logs lively in the container
logs:
	@docker compose logs --follow --tail 100

# Shows logs lively in the selected container
logs-%:
	@while true; do docker compose logs --tail 100 --follow $*; sleep 1; done

# ---------------------------------------------------------------------------- #
# Stop the containers and remove the volumes
clean:
	-@docker compose rm -svf

# Stop the containers and remove the volumes and images
fclean: clean
	-@docker compose down --rmi local -v
	-@docker volume prune -f 2> /dev/null
	-@docker rmi -f postgres:13  > /dev/null
	-@docker rmi -f redis:7  > /dev/null

# Delete all migrations
delete_migrations:
	-@find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

# Populate database
pop:
	@docker compose exec backend python3 transcendence/manage.py populate_db

# Delete all users
depop:
	@docker compose exec backend python3 transcendence/manage.py clear_users

.PHONY: all up down reup pop shell-% logs logs-% help clean fclean delete_migrations django status