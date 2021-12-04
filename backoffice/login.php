<?php

	include_once 'functions.php';

	head();
?>

<div class="d-flex w-100 h-100">
	<form action="" class="">
		<div class="mb-3">
			<label for="exampleFormControlInput1" class="form-label">usuário</label>
			<input type="text" class="form-control" name="user" id="user" placeholder="usuário ou email">
		</div>
		<div class="mb-3">
			<label for="exampleFormControlInput1" class="form-label">senha</label>
			<input type="password" class="form-control" name="password" id="password" >
		</div>
	</form>
</div>


<?php
	footer();
?>