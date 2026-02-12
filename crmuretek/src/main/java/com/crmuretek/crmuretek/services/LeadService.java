package com.crmuretek.crmuretek.services;

import com.crmuretek.crmuretek.models.Lead;
import com.crmuretek.crmuretek.repositories.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeadService {
    @Autowired
    private LeadRepository leadRepository;


    @Transactional
    public Lead update(Long id, Lead leadDetails){
        return leadRepository.findById(id)
                .map(existing -> {
                    existing.setProblemDescription(leadDetails.getProblemDescription());
                    existing.setSource(leadDetails.getSource());
                    existing.setContactDate(leadDetails.getContactDate());
                    existing.setContactChannel(leadDetails.getContactChannel());

                    // 2. Update  the linked Customer field (Name, Phone, etc.)
                    if (existing.getCustomer() != null && leadDetails.getCustomer() != null) {
                        existing.getCustomer().setName(leadDetails.getCustomer().getName());
                        existing.getCustomer().setPhoneNumber(leadDetails.getCustomer().getPhoneNumber());
                        existing.getCustomer().setEmail(leadDetails.getCustomer().getEmail());
                        existing.getCustomer().setAddress(leadDetails.getCustomer().getAddress());
                    }

                    return leadRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Lead not found: " + id));
    }
}
