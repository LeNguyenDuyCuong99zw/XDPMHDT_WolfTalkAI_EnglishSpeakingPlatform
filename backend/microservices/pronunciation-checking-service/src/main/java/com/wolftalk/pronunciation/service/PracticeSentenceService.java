package com.wolftalk.pronunciation.service;

import com.wolftalk.pronunciation.entity.PracticeSentence;
import com.wolftalk.pronunciation.repository.PracticeSentenceRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PracticeSentenceService {
    
    private final PracticeSentenceRepository sentenceRepository;
    private final RestTemplate restTemplate;
    private final Random random = new Random();
    
    // API URL provided by user
    private static final String BACON_IPSUM_API = "https://baconipsum.com/api/?type=all-meat&sentences=1";
    
    @PostConstruct
    public void initData() {
        // Check if we have enough sentences (less than 50 means we need to add more)
        if (sentenceRepository.count() < 50) {
            log.info("Populating DB with more sample sentences...");
            List<PracticeSentence> initialSentences = List.of(
                // Beginner
                PracticeSentence.builder().text("The quick brown fox jumps over the lazy dog.").difficultyLevel("BEGINNER").topic("General").build(),
                PracticeSentence.builder().text("I like to drink coffee in the morning.").difficultyLevel("BEGINNER").topic("Daily Life").build(),
                PracticeSentence.builder().text("The cat is sleeping on the sofa.").difficultyLevel("BEGINNER").topic("Daily Life").build(),
                PracticeSentence.builder().text("My brother plays football every weekend.").difficultyLevel("BEGINNER").topic("Hobbies").build(),
                PracticeSentence.builder().text("It is raining outside today.").difficultyLevel("BEGINNER").topic("Weather").build(),
                PracticeSentence.builder().text("Can you help me with my homework?").difficultyLevel("BEGINNER").topic("School").build(),
                PracticeSentence.builder().text("I want to buy a new phone.").difficultyLevel("BEGINNER").topic("Shopping").build(),
                PracticeSentence.builder().text("She lives in a small house near the park.").difficultyLevel("BEGINNER").topic("Daily Life").build(),
                PracticeSentence.builder().text("We are going to the cinema tonight.").difficultyLevel("BEGINNER").topic("Entertainment").build(),
                PracticeSentence.builder().text("He cooks dinner for his family every day.").difficultyLevel("BEGINNER").topic("Family").build(),
                PracticeSentence.builder().text("The train arrives at 10 o'clock.").difficultyLevel("BEGINNER").topic("Travel").build(),

                // Intermediate
                PracticeSentence.builder().text("I have been working here for five years.").difficultyLevel("INTERMEDIATE").topic("Work").build(),
                PracticeSentence.builder().text("The weather in London is often unpredictable.").difficultyLevel("INTERMEDIATE").topic("Weather").build(),
                PracticeSentence.builder().text("Travelling opens your mind to new experiences.").difficultyLevel("INTERMEDIATE").topic("Travel").build(),
                PracticeSentence.builder().text("She suggested we should go to the new Italian restaurant.").difficultyLevel("INTERMEDIATE").topic("Food").build(),
                PracticeSentence.builder().text("Although it was late, they decided to continue working.").difficultyLevel("INTERMEDIATE").topic("Work").build(),
                PracticeSentence.builder().text("I would like to make a reservation for two people.").difficultyLevel("INTERMEDIATE").topic("Travel").build(),
                PracticeSentence.builder().text("The project was completed ahead of schedule.").difficultyLevel("INTERMEDIATE").topic("Business").build(),
                PracticeSentence.builder().text("Learning a new language requires patience and practice.").difficultyLevel("INTERMEDIATE").topic("Education").build(),
                PracticeSentence.builder().text("He is responsible for managing the sales team.").difficultyLevel("INTERMEDIATE").topic("Business").build(),
                PracticeSentence.builder().text("If I had known, I would have called you sooner.").difficultyLevel("INTERMEDIATE").topic("Relationships").build(),

                // Advanced
                PracticeSentence.builder().text("The economic situation has improved significantly this year.").difficultyLevel("ADVANCED").topic("Economics").build(),
                PracticeSentence.builder().text("Sustainability is a crucial aspect of modern business strategy.").difficultyLevel("ADVANCED").topic("Business").build(),
                PracticeSentence.builder().text("The nuances of the argument were lost in translation.").difficultyLevel("ADVANCED").topic("Communication").build(),
                PracticeSentence.builder().text("She demonstrated exceptional leadership skills during the crisis.").difficultyLevel("ADVANCED").topic("Leadership").build(),
                PracticeSentence.builder().text("They are investigating the long-term effects of climate change.").difficultyLevel("ADVANCED").topic("Environment").build(),
                PracticeSentence.builder().text("The architecture of the city reflects its rich cultural heritage.").difficultyLevel("ADVANCED").topic("Culture").build(),
                PracticeSentence.builder().text("Effective communication is paramount in international relations.").difficultyLevel("ADVANCED").topic("Politics").build(),
                PracticeSentence.builder().text("Innovation drives the technological advancement of society.").difficultyLevel("ADVANCED").topic("Technology").build(),
                PracticeSentence.builder().text("He articulated his thoughts with remarkable clarity and precision.").difficultyLevel("ADVANCED").topic("Communication").build(),
                PracticeSentence.builder().text("The phenomenon can be explained by the laws of thermodynamics.").difficultyLevel("ADVANCED").topic("Science").build(),
                // Beginner (continued)
                PracticeSentence.builder().text("The sun rises in the east.").difficultyLevel("BEGINNER").topic("Nature").build(),
                PracticeSentence.builder().text("Birds fly south for the winter.").difficultyLevel("BEGINNER").topic("Nature").build(),
                PracticeSentence.builder().text("She bought a red dress for the party.").difficultyLevel("BEGINNER").topic("Shopping").build(),
                PracticeSentence.builder().text("My favorite color is blue.").difficultyLevel("BEGINNER").topic("General").build(),
                PracticeSentence.builder().text("Please close the door behind you.").difficultyLevel("BEGINNER").topic("General").build(),
                PracticeSentence.builder().text("The baby is sleeping in the crib.").difficultyLevel("BEGINNER").topic("Family").build(),
                PracticeSentence.builder().text("I need to go to the supermarket.").difficultyLevel("BEGINNER").topic("Daily Life").build(),
                PracticeSentence.builder().text("He drives a black car.").difficultyLevel("BEGINNER").topic("Transport").build(),
                PracticeSentence.builder().text("We played tennis yesterday afternoon.").difficultyLevel("BEGINNER").topic("Hobbies").build(),
                PracticeSentence.builder().text("The water in the pool is very cold.").difficultyLevel("BEGINNER").topic("Sports").build(),

                // Intermediate (continued)
                PracticeSentence.builder().text("The concert was cancelled due to heavy rain.").difficultyLevel("INTERMEDIATE").topic("Entertainment").build(),
                PracticeSentence.builder().text("Generally speaking, I prefer tea over coffee.").difficultyLevel("INTERMEDIATE").topic("Preferences").build(),
                PracticeSentence.builder().text("She managed to finish the marathon despite the injury.").difficultyLevel("INTERMEDIATE").topic("Sports").build(),
                PracticeSentence.builder().text("It is important to maintain a healthy work-life balance.").difficultyLevel("INTERMEDIATE").topic("Health").build(),
                PracticeSentence.builder().text("The museum offers a discount for students and seniors.").difficultyLevel("INTERMEDIATE").topic("Culture").build(),
                PracticeSentence.builder().text("Have you ever considered moving to another country?").difficultyLevel("INTERMEDIATE").topic("Life").build(),
                PracticeSentence.builder().text("The instructions were too complicated to follow.").difficultyLevel("INTERMEDIATE").topic("General").build(),
                PracticeSentence.builder().text("He apologized for being late to the meeting.").difficultyLevel("INTERMEDIATE").topic("Work").build(),
                PracticeSentence.builder().text("Technology has changed the way we communicate.").difficultyLevel("INTERMEDIATE").topic("Technology").build(),
                PracticeSentence.builder().text("I am looking forward to hearing from you soon.").difficultyLevel("INTERMEDIATE").topic("Business").build(),

                // Advanced (continued)
                PracticeSentence.builder().text("The philosophical implications of quantum mechanics are profound.").difficultyLevel("ADVANCED").topic("Science").build(),
                PracticeSentence.builder().text("Her dissertation explores the intricacies of post-colonial literature.").difficultyLevel("ADVANCED").topic("Literature").build(),
                PracticeSentence.builder().text("The government implemented austere fiscal measures to combat inflation.").difficultyLevel("ADVANCED").topic("Economics").build(),
                PracticeSentence.builder().text("Ubiquitous computing is transforming the urban landscape.").difficultyLevel("ADVANCED").topic("Technology").build(),
                PracticeSentence.builder().text("The juxtaposition of ancient and modern architecture is striking.").difficultyLevel("ADVANCED").topic("Art").build(),
                PracticeSentence.builder().text("He exhibited a nonchalant attitude towards the impending deadline.").difficultyLevel("ADVANCED").topic("Work").build(),
                PracticeSentence.builder().text("The paradox of tolerance states that unlimited tolerance leads to the disappearance of tolerance.").difficultyLevel("ADVANCED").topic("Philosophy").build(),
                PracticeSentence.builder().text("Neuroplasticity refers to the brain's ability to reorganize itself.").difficultyLevel("ADVANCED").topic("Science").build(),
                PracticeSentence.builder().text("The negotiation reached an impasse due to conflicting interests.").difficultyLevel("ADVANCED").topic("Business").build(),
                PracticeSentence.builder().text("A plethora of options can sometimes lead to decision paralysis.").difficultyLevel("ADVANCED").topic("Psychology").build(),
                
                // Business English
                PracticeSentence.builder().text("We need to leverage our core competencies to gain a competitive advantage.").difficultyLevel("ADVANCED").topic("Business").build(),
                PracticeSentence.builder().text("Please find the attached financial report for your review.").difficultyLevel("INTERMEDIATE").topic("Business").build(),
                PracticeSentence.builder().text("The quarterly earnings exceeded market expectations.").difficultyLevel("ADVANCED").topic("Business").build(),
                PracticeSentence.builder().text("Collaboration is essential for the success of this cross-functional team.").difficultyLevel("INTERMEDIATE").topic("Business").build(),
                
                // Travel & Culture
                PracticeSentence.builder().text("The local cuisine is a blend of various cultural influences.").difficultyLevel("INTERMEDIATE").topic("Culture").build(),
                PracticeSentence.builder().text("Don't forget to validate your ticket before boarding the train.").difficultyLevel("BEGINNER").topic("Travel").build(),
                PracticeSentence.builder().text("Backpacking through Europe is a rite of passage for many youths.").difficultyLevel("INTERMEDIATE").topic("Travel").build(),
                
                // Tech
                PracticeSentence.builder().text("Artificial intelligence is poised to disrupt multiple industries.").difficultyLevel("ADVANCED").topic("Technology").build(),
                PracticeSentence.builder().text("Always make sure to back up your data regularly.").difficultyLevel("BEGINNER").topic("Technology").build(),
                PracticeSentence.builder().text("The software update addresses several security vulnerabilities.").difficultyLevel("INTERMEDIATE").topic("Technology").build()
            );
            sentenceRepository.saveAll(initialSentences);
        }
    }
    
    public PracticeSentence getRandomSentence(String type) {
        boolean useApi = "HARD".equalsIgnoreCase(type);
        
        if (useApi) {
            try {
                return getFromBaconIpsumApi();
            } catch (Exception e) {
                log.error("Failed to fetch from API, falling back to DB", e);
                return getFromDatabase();
            }
        } else {
            return getFromDatabase();
        }
    }
    
    private PracticeSentence getFromDatabase() {
        Optional<PracticeSentence> randomSentence = sentenceRepository.findRandomSentence();
        return randomSentence.orElseGet(() -> {
            // Absolute fallback if DB is somehow empty
            return PracticeSentence.builder()
                .text("Hello world, this is a fallback sentence.")
                .difficultyLevel("BEGINNER")
                .topic("Fallback")
                .build();
        });
    }
    
    private PracticeSentence getFromBaconIpsumApi() {
        // API returns a JSON array of strings: ["Short loin pork belly..."]
        String[] response = restTemplate.getForObject(BACON_IPSUM_API, String[].class);
        
        if (response != null && response.length > 0) {
            String text = response[0];
            return PracticeSentence.builder()
                .text(text)
                .difficultyLevel("RANDOM") // API doesn't specify difficulty
                .topic("Meat Lover")      // Bacon Ipsum is about meat!
                .build();
        }
        throw new RuntimeException("Empty response from API");
    }
}
