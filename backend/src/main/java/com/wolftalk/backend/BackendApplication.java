package com.wolftalk.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.wolftalk.backend" })
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println(">>> STARTING APPLICATION <<<");
		try {
			SpringApplication app = new SpringApplication(BackendApplication.class);
			app.setWebApplicationType(org.springframework.boot.WebApplicationType.SERVLET);
			app.run(args);
			System.out.println(">>> SPRING RUN COMPLETED <<<");
			// Keep alive if for some reason Tomcat isn't
			Thread.currentThread().join();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
