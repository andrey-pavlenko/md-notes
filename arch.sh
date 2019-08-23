#!/bin/sh

tty -s; if [ $? -ne 0 ]; then konsole -e "$0"; exit; fi

function archive {
	# Текущая директория
	DIRECTORY="$(basename $(pwd))"
	# Название архива
	ARCHIVE="$DIRECTORY.tar.gz"
	# директория уровнем выше
	PARENT_DIRECTORY="$(dirname $(pwd))"

	#Исключения
	EXCLUDE=""
	if [ -f tar.exclude ]; then
		EXCLUDE="--exclude-from=tar.exclude"
	fi
	
	# Архивация
	tar cfz "../$ARCHIVE" -C "$PARENT_DIRECTORY" $EXCLUDE "$DIRECTORY/"
}

function remove_tared {
	EXCLUDES=("./"
	"./node_modules"
	# "./frontend"
	# "./frontend/node_modules"
	# "./frontend/yarn.lock"
	# "./backend"
	# "./backend/.venv"
	# "./backend/Pipfile.lock"
	"./$0")


	for FILE in $(find ./ -maxdepth 2)
	do
		REMOVE=true
		for EXCLUDE in "${EXCLUDES[@]}"
		do
			if [ "$FILE" = "$EXCLUDE" ]
			then
				REMOVE=false
			fi
		done
		if [ $REMOVE = true ]
		then
 			rm -rf $FILE
		fi
	done
}


echo "Archiving..."
archive
if [ $? -eq 0 ]; then
	echo "Remove TARed files? [y/n]"
	read -s -n 1 ANSWER
	if [ $ANSWER = 'y' ]; then
		remove_tared
	fi
fi
