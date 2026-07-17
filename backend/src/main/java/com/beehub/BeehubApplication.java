package com.beehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

//retirar isso após a criação do banco
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class BeehubApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeehubApplication.class, args);
	}

}
